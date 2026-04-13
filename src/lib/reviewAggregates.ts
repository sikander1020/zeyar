import Review from '@/models/Review';
import Product from '@/models/Product';

/**
 * Recalculate and persist product review aggregates from approved reviews only.
 */
export async function syncProductReviewAggregates(productId: string) {
  const pid = String(productId ?? '').trim();
  if (!pid) return;

  const stats = await Review.aggregate([
    { $match: { productId: pid, isApproved: true } },
    {
      $group: {
        _id: '$productId',
        reviewCount: { $sum: 1 },
        rating: { $avg: '$rating' },
      },
    },
  ]);

  const row = stats[0] as { reviewCount?: number; rating?: number } | undefined;
  const reviewCount = Number(row?.reviewCount) || 0;
  const rating = reviewCount > 0 ? Number((Number(row?.rating) || 0).toFixed(2)) : 0;

  await Product.updateOne(
    { productId: pid },
    {
      $set: {
        reviewCount,
        rating,
      },
    },
  );
}
