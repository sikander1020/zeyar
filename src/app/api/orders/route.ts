import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import { requireAdmin } from '@/lib/adminAuth';
import { rateLimit } from '@/lib/rateLimit';

// Generate a short readable order ID
function generateOrderId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}-${rand}`;
}

type CouponDoc = {
  _id: unknown;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  applicableCategories: string[];
  applicableProducts: string[];
};

function couponAppliesToItems(coupon: CouponDoc, items: Array<{ productId: string; category: string }>): boolean {
  const hasCatRule = coupon.applicableCategories.length > 0;
  const hasProdRule = coupon.applicableProducts.length > 0;
  if (!hasCatRule && !hasProdRule) return true;

  return items.some((item) => {
    const catOk = !hasCatRule || coupon.applicableCategories.includes(item.category);
    const prodOk = !hasProdRule || coupon.applicableProducts.includes(item.productId);
    return catOk && prodOk;
  });
}

function computeDiscount(coupon: CouponDoc, subtotal: number): number {
  if (coupon.discountType === 'fixed') {
    return Math.min(coupon.discountValue, subtotal);
  }

  const raw = (subtotal * coupon.discountValue) / 100;
  const capped = coupon.maxDiscountValue > 0 ? Math.min(raw, coupon.maxDiscountValue) : raw;
  return Math.min(capped, subtotal);
}

// POST /api/orders — place a new order
export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'orders', { windowMs: 60_000, max: 20 });
    if (rl) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    await connectDB();
    const body = await req.json();

    const {
      customer, items,
      paymentMethod = 'COD',
      couponCode = '',
    } = body;

    if (!customer || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = generateOrderId();
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // Recalculate totals server-side (do not trust client totals/prices)
        const productIds = (items as { productId: string }[]).map((i) => i.productId);
        const products = await Product.find({ productId: { $in: productIds } })
          .select('productId price stock')
          .lean({ virtuals: false })
          .session(session);

        const priceById = new Map(products.map((p) => [p.productId, p.price]));

        const safeItems = (items as Array<{
          productId: string; name: string; category?: string;
          qty: number; price?: number; size?: string; color?: string;
        }>).map((i) => {
          const serverPrice = priceById.get(i.productId);
          if (typeof serverPrice !== 'number') {
            throw new Error(`UNKNOWN_PRODUCT:${i.productId}`);
          }
          return {
            productId: i.productId,
            name: i.name,
            category: i.category ?? '',
            qty: i.qty,
            price: serverPrice,
            size: i.size ?? '',
            color: i.color ?? '',
          };
        });

        const subtotal = safeItems.reduce((sum, i) => sum + i.qty * i.price, 0);
        let discount = 0;
        let couponData: { code: string; amount: number; couponId: string } | undefined;

        const trimmedCoupon = String(couponCode).trim().toUpperCase();
        if (trimmedCoupon) {
          const coupon = await Coupon.findOne({ code: trimmedCoupon, isActive: true })
            .session(session)
            .lean() as CouponDoc | null;

          if (!coupon) throw new Error('INVALID_COUPON');

          const now = new Date();
          if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
            throw new Error('COUPON_EXPIRED');
          }

          if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            throw new Error('COUPON_LIMIT');
          }

          if (subtotal < (coupon.minOrderValue || 0)) {
            throw new Error('COUPON_MIN_ORDER');
          }

          if (!couponAppliesToItems(coupon, safeItems.map((i) => ({ productId: i.productId, category: i.category })))) {
            throw new Error('COUPON_NOT_APPLICABLE');
          }

          discount = Math.round(computeDiscount(coupon, subtotal));
          couponData = {
            code: coupon.code,
            amount: discount,
            couponId: String(coupon._id),
          };

          await Coupon.updateOne(
            {
              _id: coupon._id,
              $or: [
                { usageLimit: 0 },
                { $expr: { $lt: ['$usedCount', '$usageLimit'] } },
              ],
            },
            { $inc: { usedCount: 1 } },
            { session },
          );
        }

        const total = subtotal - discount;

        for (const item of items as { productId: string; qty: number }[]) {
          const updated = await Product.findOneAndUpdate(
            { productId: item.productId, stock: { $gte: item.qty } },
            { $inc: { stock: -item.qty, sold: item.qty } },
            { session, new: true },
          );
          if (!updated) {
            throw new Error(`INSUFFICIENT_STOCK:${item.productId}`);
          }
        }

        const uploadToken = paymentMethod === 'bank'
          ? randomBytes(18).toString('hex')
          : '';

        await Order.create([{
          orderId,
          customer,
          items: safeItems,
          subtotal,
          discount,
          coupon: couponData,
          total,
          paymentMethod,
          paymentStatus: paymentMethod === 'card' ? 'paid' : 'unpaid',
          status: 'pending',
          bankTransfer: paymentMethod === 'bank'
            ? { uploadToken, status: 'awaiting_proof' }
            : undefined,
        }], { session });
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.startsWith('UNKNOWN_PRODUCT:')) {
        return NextResponse.json({ error: 'Some items are no longer available. Please refresh and try again.' }, { status: 409 });
      }
      if (msg.startsWith('INSUFFICIENT_STOCK:')) {
        return NextResponse.json(
          { error: 'One or more items are out of stock. Please refresh and try again.' },
          { status: 409 },
        );
      }
      if (['INVALID_COUPON', 'COUPON_EXPIRED', 'COUPON_LIMIT', 'COUPON_MIN_ORDER', 'COUPON_NOT_APPLICABLE'].includes(msg)) {
        return NextResponse.json({ error: 'Coupon is invalid for this order.' }, { status: 409 });
      }
      throw e;
    } finally {
      await session.endSession();
    }

    // If bank transfer, send token back for the proof upload page.
    if (paymentMethod === 'bank') {
      const order = await Order.findOne({ orderId }).select('bankTransfer.uploadToken').lean();
      return NextResponse.json({ success: true, orderId, uploadToken: order?.bankTransfer?.uploadToken ?? '' }, { status: 201 });
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/orders — list all orders (admin use)
export async function GET(req: NextRequest) {
  try {
    // Admin-only
    const guard = requireAdmin(req);
    if (guard) return guard;
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
