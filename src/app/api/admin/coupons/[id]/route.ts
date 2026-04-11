import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { requireAdmin } from '@/lib/adminAuth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const coupon = await Coupon.findOneAndUpdate(
      { _id: id },
      {
        code: body.code?.toUpperCase(),
        description: body.description,
        discountType: body.discountType,
        discountValue: body.discountValue,
        minOrderValue: body.minOrderValue,
        maxDiscountValue: body.maxDiscountValue,
        usageLimit: body.usageLimit,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        isActive: body.isActive,
        applicableCategories: body.applicableCategories,
        applicableProducts: body.applicableProducts,
      },
      { new: true }
    );

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (err) {
    console.error('PUT /api/admin/coupons/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const { id } = await params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/coupons/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
