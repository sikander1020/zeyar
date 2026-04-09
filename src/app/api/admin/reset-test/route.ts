import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Order from '@/models/Order';
import Product from '@/models/Product';

/**
 * Admin-only: wipe ALL orders and reset inventory.
 * Use before launch to remove dummy/testing records.
 */
export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const { confirm } = await req.json() as { confirm?: string };
    if (confirm !== 'RESET_TEST_DATA') {
      return NextResponse.json({ error: 'Missing confirmation' }, { status: 400 });
    }

    await connectDB();

    const session = await mongoose.startSession();
    const result = await session.withTransaction(async () => {
      const ordersCount = await Order.countDocuments().session(session);
      await Order.deleteMany({}).session(session);
      await Product.updateMany({}, { $set: { sold: 0, stock: 50 } }).session(session);
      return { ordersDeleted: ordersCount };
    });
    await session.endSession();

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('POST /api/admin/reset-test error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

