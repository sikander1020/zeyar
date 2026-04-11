import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const productId = (url.searchParams.get('productId') ?? '').trim();

    const q: { isApproved: boolean; productId?: string } = { isApproved: true };
    if (productId) q.productId = productId;

    const reviews = await Review.find(q)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error('GET /api/reviews error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'reviews-submit', { windowMs: 60_000, max: 10 });
    if (rl) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    await connectDB();

    const body = await req.json() as {
      productId?: string;
      productName?: string;
      customerName?: string;
      customerEmail?: string;
      rating?: number;
      title?: string;
      comment?: string;
      orderId?: string;
    };

    const productId = (body.productId ?? '').trim();
    const productName = (body.productName ?? '').trim();
    const customerName = (body.customerName ?? '').trim();
    const customerEmail = (body.customerEmail ?? '').trim().toLowerCase();
    const comment = (body.comment ?? '').trim();
    const title = (body.title ?? '').trim();
    const orderId = (body.orderId ?? '').trim();
    const rating = Number(body.rating) || 0;

    if (!productId || !productName || !customerName || !customerEmail || !comment || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let isVerifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({ orderId, 'customer.email': customerEmail }).lean() as
        | { items?: Array<{ productId?: string }> }
        | null;
      if (order) {
        const items: Array<{ productId?: string }> = Array.isArray(order.items) ? order.items : [];
        const hasProduct = items.some((i) => i.productId === productId);
        isVerifiedPurchase = hasProduct;
      }
    }

    const review = await Review.create({
      reviewId: `rev_${Date.now()}`,
      productId,
      productName,
      customerName,
      customerEmail,
      rating,
      title,
      comment,
      images: [],
      isApproved: false,
      isVerifiedPurchase,
      orderId,
    });

    return NextResponse.json({ success: true, reviewId: review.reviewId }, { status: 201 });
  } catch (err) {
    console.error('POST /api/reviews error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
