import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status are required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order: any = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (status === 'shipped' && order.customer?.email) {
      import('@/lib/sendEmail').then(({ sendEmail }) => {
        import('@/lib/emailTemplates').then(({ getOrderShippedEmail }) => {
          const html = getOrderShippedEmail(orderId, order.customer.firstName);
          sendEmail(order.customer.email.toLowerCase(), `Order Shipped: Zaybaash #${orderId}`, html);
        });
      }).catch(console.error);
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('POST /api/admin/orders/update-status error:', err);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
