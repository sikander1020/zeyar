import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/adminAuth';

/**
 * Mark COD payment as received by admin.
 * Moves pending COD order -> confirmed + paid (so revenue updates).
 */
export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const { orderId } = await req.json() as { orderId?: string };
    if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });

    await connectDB();

    const res = await Order.updateOne(
      { orderId, paymentMethod: 'COD', paymentStatus: 'unpaid', status: 'pending' },
      { $set: { paymentStatus: 'paid', status: 'confirmed' } },
    );

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found or not eligible' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/admin/orders/cod-received error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

