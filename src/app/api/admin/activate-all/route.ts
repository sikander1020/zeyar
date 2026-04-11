import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();

    const result = await Product.updateMany(
      { isActive: false },
      { isActive: true }
    );

    return NextResponse.json({ 
      success: true, 
      updated: result.modifiedCount,
      message: `Activated ${result.modifiedCount} inactive products`
    });
  } catch (err) {
    console.error('POST /api/admin/activate-all error:', err);
    return NextResponse.json({ error: 'Failed to activate products' }, { status: 500 });
  }
}
