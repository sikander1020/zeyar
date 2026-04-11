import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ coupons });
  } catch (err) {
    console.error('GET /api/admin/coupons error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const body = await req.json();

    const coupon = new Coupon({
      code: body.code.toUpperCase(),
      description: body.description || '',
      discountType: body.discountType || 'percentage',
      discountValue: body.discountValue,
      minOrderValue: body.minOrderValue || 0,
      maxDiscountValue: body.maxDiscountValue || 0,
      usageLimit: body.usageLimit || 0,
      usedCount: 0,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      isActive: body.isActive !== false,
      applicableCategories: body.applicableCategories || [],
      applicableProducts: body.applicableProducts || [],
    });

    await coupon.save();
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/coupons error:', err);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
