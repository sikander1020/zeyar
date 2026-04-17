import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const { orderId } = await req.json() as { orderId?: string };
    if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });

    try {
      await connectDB();
    } catch (dbErr) {
      const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      console.error(`DB connection failed in approve endpoint: ${errMsg}`);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }

    try {
      const res = await Order.updateOne(
        {
          orderId,
          paymentMethod: 'bank',
          paymentStatus: 'unpaid',
          'bankTransfer.status': 'proof_submitted',
        },
        {
          $set: {
            paymentStatus: 'paid',
            status: 'confirmed',
            'bankTransfer.status': 'approved',
            'bankTransfer.reviewedAt': new Date(),
          },
        },
      );

      if (res.matchedCount === 0) {
        console.warn(`Bank proof approval failed - order not found or wrong state: ${orderId}`);
        return NextResponse.json({ error: 'Order not found or not pending proof' }, { status: 404 });
      }

      console.log(`Bank proof approved for order: ${orderId}`);
      return NextResponse.json({ success: true });
    } catch (updateErr) {
      const errMsg = updateErr instanceof Error ? updateErr.message : String(updateErr);
      console.error(`Order update failed in approve for ${orderId}: ${errMsg}`);
      return NextResponse.json({ error: 'Failed to approve payment' }, { status: 503 });
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('POST /api/admin/bank-proof/approve unexpected error:', errMsg);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

