import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';

// Flat-table endpoint optimised for Power BI "Web" connector.
// Each key is a table that Power BI can import directly — no manual
// JSON expansion needed.
export async function GET(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;
    await connectDB();

    // ── KPI Summary (single-row table) ──────────────────────────────────
    const [rev] = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue:    { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$total', 0] } },
          totalOrders:     { $sum: 1 },
          avgOrderValue:   { $avg: '$total' },
          totalDiscount:   { $sum: '$discount' },
          pendingOrders:   { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmedOrders: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          shippedOrders:   { $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] } },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        },
      },
    ]);

    // ── Profit summary ──────────────────────────────────────────────────
    const [profit] = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products', localField: 'items.productId',
          foreignField: 'productId', as: 'prod',
        },
      },
      { $unwind: { path: '$prod', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalCOGS:  { $sum: { $multiply: ['$items.qty', { $ifNull: ['$prod.costPrice', 0] }] } },
          totalSales: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
        },
      },
      {
        $addFields: {
          grossProfit:  { $subtract: ['$totalSales', '$totalCOGS'] },
          profitMargin: {
            $cond: [
              { $gt: ['$totalSales', 0] },
              { $multiply: [{ $divide: [{ $subtract: ['$totalSales', '$totalCOGS'] }, '$totalSales'] }, 100] },
              0,
            ],
          },
        },
      },
    ]);

    // ── Orders (flat rows) ───────────────────────────────────────────────
    const rawOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .select('orderId customer total discount paymentMethod paymentStatus status createdAt bankTransfer')
      .lean();

    const orders = rawOrders.map((o) => ({
      orderId:       o.orderId,
      customerName:  o.customer?.name ?? '',
      customerEmail: o.customer?.email ?? '',
      customerCity:  o.customer?.address?.city ?? '',
      total:         o.total,
      discount:      o.discount ?? 0,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      status:        o.status,
      bankTransferStatus: o.bankTransfer?.status ?? '',
      date:          o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : '',
      time:          o.createdAt ? new Date(o.createdAt).toISOString().slice(11, 19) : '',
      placedAt:      o.createdAt ? new Date(o.createdAt).toISOString() : '',
      month:         o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 7) : '',
    }));

    // ── Order Items (flat rows) ──────────────────────────────────────────
    const rawItems = await Order.find({})
      .select('orderId items createdAt')
      .lean();

    const orderItems: object[] = [];
    for (const o of rawItems) {
      for (const item of (o.items ?? [])) {
        orderItems.push({
          orderId:   o.orderId,
          productId: item.productId,
          name:      item.name,
          category:  item.category,
          qty:       item.qty,
          price:     item.price,
          size:      item.size,
          color:     item.color,
          lineTotal: item.qty * item.price,
          date:      o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : '',
        });
      }
    }

    // ── Daily Revenue (last 90 days, flat rows) ──────────────────────────
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: ninetyDaysAgo }, status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
      {
        $group: {
          _id:     { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyRevenueFlat = dailyRevenue.map((d) => ({
      date:    d._id,
      revenue: d.revenue,
      orders:  d.orders,
    }));

    // ── Monthly Revenue (flat rows) ──────────────────────────────────────
    const monthlyRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
      {
        $group: {
          _id:     { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders:  { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyRevenueFlat = monthlyRevenue.map((m) => ({
      month:   m._id,
      revenue: m.revenue,
      orders:  m.orders,
    }));

    // ── Category Revenue (flat rows) ─────────────────────────────────────
    const catRev = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
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

    const categoryRevenue = catRev.map((c) => ({
      category: c._id ?? 'Uncategorised',
      revenue:  c.revenue,
      units:    c.units,
    }));

    // ── Top Products (flat rows) ─────────────────────────────────────────
    const topProds = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id:       '$items.productId',
          name:      { $first: '$items.name' },
          category:  { $first: '$items.category' },
          unitsSold: { $sum: '$items.qty' },
          revenue:   { $sum: { $multiply: ['$items.qty', '$items.price'] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 20 },
    ]);

    const topProducts = topProds.map((p) => ({
      productId: p._id,
      name:      p.name,
      category:  p.category,
      unitsSold: p.unitsSold,
      revenue:   p.revenue,
    }));

    // ── Payment Split (flat rows) ────────────────────────────────────────
    const paySplit = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
    ]);

    const paymentSplit = paySplit.map((p) => ({
      method:  p._id ?? 'unknown',
      count:   p.count,
      revenue: p.revenue,
    }));

    // ── Order Status Distribution (flat rows) ────────────────────────────
    const statusDist = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const orderStatus = statusDist.map((s) => ({
      status: s._id ?? 'unknown',
      count:  s.count,
    }));

    // ── City Stats (flat rows) ───────────────────────────────────────────
    const cityRaw = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
      {
        $group: {
          _id:      '$customer.city',
          orders:   { $sum: 1 },
          revenue:  { $sum: '$total' },
          avgSpend: { $avg: '$total' },
        },
      },
      { $sort: { orders: -1 } },
    ]);

    const totalOrderCount = cityRaw.reduce((s, c) => s + c.orders, 0) || 1;
    const cityStats = cityRaw.map((c) => ({
      city:          c._id ?? 'Unknown',
      orders:        c.orders,
      revenue:       +c.revenue.toFixed(2),
      avgSpend:      +c.avgSpend.toFixed(2),
      pctOfOrders:   +((c.orders / totalOrderCount) * 100).toFixed(1),
    }));

    // ── Customer list (flat rows) ────────────────────────────────────────
    const custRaw = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } },
      {
        $group: {
          _id:        '$customer.email',
          firstName:  { $first: '$customer.firstName' },
          lastName:   { $first: '$customer.lastName' },
          city:       { $first: '$customer.city' },
          state:      { $first: '$customer.state' },
          orderCount: { $sum: 1 },
          totalSpend: { $sum: '$total' },
        },
      },
      { $sort: { totalSpend: -1 } },
    ]);

    const customers = custRaw.map((c) => ({
      email:      c._id ?? '',
      name:       `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim(),
      city:       c.city ?? '',
      state:      c.state ?? '',
      orderCount: c.orderCount,
      totalSpend: +c.totalSpend.toFixed(2),
    }));

    // ── Inventory (flat rows) ────────────────────────────────────────────
    const rawProducts = await Product.find({})
      .select('productId name category price costPrice stock sold')
      .lean();

    const inventory = rawProducts.map((p) => ({
      productId:    p.productId,
      name:         p.name,
      category:     p.category,
      price:        p.price,
      costPrice:    p.costPrice,
      margin:       p.price > 0 ? +((p.price - p.costPrice) / p.price * 100).toFixed(1) : 0,
      stock:        p.stock,
      sold:         p.sold,
      stockValue:   +(p.stock * p.costPrice).toFixed(2),
      revenueValue: +(p.sold * p.price).toFixed(2),
    }));

    // ── Assemble summary KPI row ─────────────────────────────────────────
    const summary = [{
      totalRevenue:    rev?.totalRevenue    ?? 0,
      totalOrders:     rev?.totalOrders     ?? 0,
      avgOrderValue:   +(rev?.avgOrderValue ?? 0).toFixed(2),
      totalDiscount:   rev?.totalDiscount   ?? 0,
      pendingOrders:   rev?.pendingOrders   ?? 0,
      confirmedOrders: rev?.confirmedOrders ?? 0,
      shippedOrders:   rev?.shippedOrders   ?? 0,
      deliveredOrders: rev?.deliveredOrders ?? 0,
      cancelledOrders: rev?.cancelledOrders ?? 0,
      totalCOGS:       +(profit?.totalCOGS    ?? 0).toFixed(2),
      grossProfit:     +(profit?.grossProfit  ?? 0).toFixed(2),
      profitMargin:    +(profit?.profitMargin ?? 0).toFixed(1),
    }];

    return NextResponse.json(
      {
        summary,
        orders,
        orderItems,
        dailyRevenue:    dailyRevenueFlat,
        monthlyRevenue:  monthlyRevenueFlat,
        categoryRevenue,
        topProducts,
        paymentSplit,
        orderStatus,
        cityStats,
        customers,
        inventory,
      },
      {
        headers: {
          'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
        },
      },
    );
  } catch (err) {
    console.error('GET /api/powerbi error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
