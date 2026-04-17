import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    try {
      await connectDB();
    } catch (dbErr) {
      const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      console.error(`DB connection failed in bank-proof list endpoint: ${errMsg}`);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }

    try {
      const orders = await Order.find({
        paymentMethod: 'bank',
        paymentStatus: 'unpaid',
        'bankTransfer.status': 'proof_submitted',
      })
        .sort({ 'bankTransfer.submittedAt': -1 })
        .limit(200)
        .select('orderId customer total bankTransfer createdAt')
        .lean();

      console.log(`Retrieved ${orders.length} pending bank proofs`);
      return NextResponse.json({ orders });
    } catch (queryErr) {
      const errMsg = queryErr instanceof Error ? queryErr.message : String(queryErr);
      console.error(`Database query failed in bank-proof list: ${errMsg}`);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 503 });
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('GET /api/admin/bank-proof/list unexpected error:', errMsg);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

