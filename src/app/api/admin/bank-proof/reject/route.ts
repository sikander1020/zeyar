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

    await connectDB();

    const session = await mongoose.startSession();
    const now = new Date();
    const res = await session.withTransaction(async () => {
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
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Order not found or not pending proof' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/admin/bank-proof/reject error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

