import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();

    const orders = await Order.find({
      paymentMethod: 'bank',
      paymentStatus: 'unpaid',
      'bankTransfer.status': 'proof_submitted',
    })
      .sort({ 'bankTransfer.submittedAt': -1 })
      .limit(200)
      .select('orderId customer total bankTransfer')
      .lean();

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('GET /api/admin/bank-proof/list error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

