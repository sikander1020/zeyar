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

    await connectDB();

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
      return NextResponse.json({ error: 'Order not found or not pending proof' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/admin/bank-proof/approve error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

