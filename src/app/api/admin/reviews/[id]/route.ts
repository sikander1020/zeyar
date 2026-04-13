import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import { requireAdmin } from '@/lib/adminAuth';
import { syncProductReviewAggregates } from '@/lib/reviewAggregates';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const review = await Review.findOneAndUpdate(
      { reviewId: id },
      {
        isApproved: body.isApproved,
        rating: body.rating,
        title: body.title,
        comment: body.comment,
      },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await syncProductReviewAggregates(review.productId);

    return NextResponse.json({ review });
  } catch (err) {
    console.error('PUT /api/admin/reviews/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const { id } = await params;

    const review = await Review.findOneAndDelete({ reviewId: id });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await syncProductReviewAggregates(review.productId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/reviews/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
