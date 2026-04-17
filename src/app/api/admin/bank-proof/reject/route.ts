import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const { orderId, reason } = await req.json() as { orderId?: string; reason?: string };
    if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    const rejectionReason = String(reason ?? '').trim().slice(0, 500);

    try {
      await connectDB();
    } catch (dbErr) {
      const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      console.error(`DB connection failed in bank-proof reject: ${errMsg}`);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }

    const session = await mongoose.startSession();
    let transactionResult: { ok: boolean } | null = null;
    
    try {
      const now = new Date();
      transactionResult = await session.withTransaction(async () => {
        try {
          const order = await Order.findOne({
            orderId,
            paymentMethod: 'bank',
            paymentStatus: 'unpaid',
            'bankTransfer.status': 'proof_submitted',
          })
            .select('items')
            .session(session);

          if (!order) return { ok: false as const };

          // Restore inventory (reverse the sold/stock changes made at order time)
          for (const item of order.items ?? []) {
            await Product.updateOne(
              { productId: item.productId },
              { $inc: { stock: item.qty, sold: -item.qty } },
              { session },
            );
          }

          await Order.updateOne(
            { orderId },
            {
              $set: {
                status: 'cancelled',
                'bankTransfer.status': 'rejected',
                'bankTransfer.reviewedAt': now,
                'bankTransfer.rejectionReason': rejectionReason,
              },
            },
            { session },
          );

          return { ok: true as const };
        } catch (innerErr) {
          const errMsg = innerErr instanceof Error ? innerErr.message : String(innerErr);
          console.error(`Transaction operation failed for order ${orderId}: ${errMsg}`);
          throw innerErr;
        }
      });
    } catch (txnErr) {
      const errMsg = txnErr instanceof Error ? txnErr.message : String(txnErr);
      console.error(`Transaction failed for order ${orderId}: ${errMsg}`);
      return NextResponse.json({ error: 'Database transaction failed - please try again' }, { status: 503 });
    } finally {
      await session.endSession();
    }

    if (!transactionResult?.ok) {
      console.warn(`Bank proof rejection failed - order not found or wrong state: ${orderId}`);
      return NextResponse.json({ error: 'Order not found or not pending proof' }, { status: 404 });
    }

    console.log(`Bank proof rejected for order: ${orderId}. Reason: ${rejectionReason}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errStack = err instanceof Error ? err.stack : '';
    console.error('POST /api/admin/bank-proof/reject unexpected error:', { message: errMsg, stack: errStack });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

