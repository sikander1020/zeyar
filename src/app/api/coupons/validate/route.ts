import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { rateLimit } from '@/lib/rateLimit';

type CheckoutItem = {
  productId: string;
  category?: string;
  qty: number;
  price: number;
};

function applyCouponDiscount(
  coupon: {
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscountValue: number;
  },
  subtotal: number,
): number {
  if (coupon.discountType === 'fixed') {
    return Math.min(coupon.discountValue, subtotal);
  }

  const raw = (subtotal * coupon.discountValue) / 100;
  if (coupon.maxDiscountValue > 0) {
    return Math.min(raw, coupon.maxDiscountValue, subtotal);
  }
  return Math.min(raw, subtotal);
}

function isApplicable(
  coupon: {
    applicableCategories: string[];
    applicableProducts: string[];
  },
  items: CheckoutItem[],
): boolean {
  const categoryRule = coupon.applicableCategories.length > 0;
  const productRule = coupon.applicableProducts.length > 0;

  if (!categoryRule && !productRule) return true;

  return items.some((item) => {
    const categoryOk = !categoryRule || coupon.applicableCategories.includes(item.category ?? '');
    const productOk = !productRule || coupon.applicableProducts.includes(item.productId);
    return categoryOk && productOk;
  });
}

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'coupon-validate', { windowMs: 60_000, max: 30 });
    if (rl) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    await connectDB();

    const body = await req.json() as {
      code?: string;
      items?: CheckoutItem[];
    };

    const code = (body.code ?? '').trim().toUpperCase();
    const items = Array.isArray(body.items) ? body.items : [];

    if (!code || items.length === 0) {
      return NextResponse.json({ error: 'Code and items are required' }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);

    const coupon = await Coupon.findOne({ code, isActive: true }).lean();
    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    const now = new Date();
    if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
      return NextResponse.json({ error: 'Coupon is not valid right now' }, { status: 409 });
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 409 });
    }

    if (subtotal < (coupon.minOrderValue || 0)) {
      return NextResponse.json({ error: `Minimum order value is Rs ${coupon.minOrderValue}` }, { status: 409 });
    }

    if (!isApplicable(coupon, items)) {
      return NextResponse.json({ error: 'Coupon does not apply to these items' }, { status: 409 });
    }

    const discount = Math.round(applyCouponDiscount(coupon, subtotal));
    const total = Math.max(0, subtotal - discount);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: String(coupon._id),
        code: coupon.code,
        description: coupon.description,
      },
      subtotal,
      discount,
      total,
    });
  } catch (err) {
    console.error('POST /api/coupons/validate error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
