import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import { requireAdmin } from '@/lib/adminAuth';
import { syncProductReviewAggregates } from '@/lib/reviewAggregates';

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error('GET /api/admin/reviews error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const body = await req.json();

    const review = new Review({
      reviewId: `rev_${Date.now()}`,
      productId: body.productId,
      productName: body.productName,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      rating: body.rating,
      title: body.title || '',
      comment: body.comment,
      images: body.images || [],
      isApproved: body.isApproved || false,
      isVerifiedPurchase: body.isVerifiedPurchase || false,
      orderId: body.orderId || '',
    });

    await review.save();

    if (review.isApproved) {
      await syncProductReviewAggregates(review.productId);
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/reviews error:', err);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
