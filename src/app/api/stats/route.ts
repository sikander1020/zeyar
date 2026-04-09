import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;
    await connectDB();

    // ── Revenue & order counts ──────────────────────────────────────────
    const revenuePipeline = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue:    { $sum: '$total' },
          totalOrders:     { $sum: 1 },
          avgOrderValue:   { $avg: '$total' },
          totalDiscount:   { $sum: '$discount' },
          paidOrders:      { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] } },
          pendingOrders:   { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmedOrders: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          shippedOrders:   { $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] } },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        },
      },
    ]);

    // ── Revenue by day (last 30 days) ───────────────────────────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ── Top products ────────────────────────────────────────────────────
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id:      '$items.productId',
          name:     { $first: '$items.name' },
          category: { $first: '$items.category' },
          unitsSold:{ $sum: '$items.qty' },
          revenue:  { $sum: { $multiply: ['$items.qty', '$items.price'] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 10 },
    ]);

    // ── Revenue by category ─────────────────────────────────────────────
    const categoryRevenue = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id:     '$items.category',
          revenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
          units:   { $sum: '$items.qty' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    // ── Payment method split ────────────────────────────────────────────
    const paymentSplit = await Order.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
    ]);

    // ── Profit (uses costPrice from products collection) ────────────────
    const profitData = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from:         'products',
          localField:   'items.productId',
          foreignField: 'productId',
          as:           'productInfo',
        },
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id:        null,
          totalCOGS:  { $sum: { $multiply: ['$items.qty', { $ifNull: ['$productInfo.costPrice', 0] }] } },
          totalSales: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
        },
      },
      {
        $addFields: {
          grossProfit:   { $subtract: ['$totalSales', '$totalCOGS'] },
          profitMargin:  {
            $cond: [
              { $gt: ['$totalSales', 0] },
              { $multiply: [{ $divide: [{ $subtract: ['$totalSales', '$totalCOGS'] }, '$totalSales'] }, 100] },
              0,
            ],
          },
        },
      },
    ]);

    // ── Inventory ───────────────────────────────────────────────────────
    const inventory = await Product.find({}, 'productId name category price costPrice stock sold').lean();

    const summary = revenuePipeline[0] ?? {
      totalRevenue: 0, totalOrders: 0, avgOrderValue: 0,
      totalDiscount: 0, paidOrders: 0,
      pendingOrders: 0, confirmedOrders: 0,
      shippedOrders: 0, deliveredOrders: 0, cancelledOrders: 0,
    };

    const profit = profitData[0] ?? { totalCOGS: 0, totalSales: 0, grossProfit: 0, profitMargin: 0 };

    return NextResponse.json({
      summary,
      profit,
      dailyRevenue,
      topProducts,
      categoryRevenue,
      paymentSplit,
      inventory,
    });
  } catch (err) {
    console.error('GET /api/stats error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
