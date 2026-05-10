import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
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

    revalidateTag('storefront-products', 'max');
    revalidateTag('storefront-categories', 'max');

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
