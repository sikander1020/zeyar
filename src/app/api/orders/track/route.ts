import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'orders-track', { windowMs: 60_000, max: 30 });
    if (rl) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const orderId = (req.nextUrl.searchParams.get('orderId') ?? '').trim();
    const email = (req.nextUrl.searchParams.get('email') ?? '').trim().toLowerCase();

    if (!orderId || !email) {
      return NextResponse.json({ error: 'Order ID and email are required' }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findOne({ orderId, 'customer.email': email })
      .select('orderId status paymentStatus paymentMethod total createdAt updatedAt customer bankTransfer')
      .lean() as {
        orderId: string;
        status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
        paymentStatus: 'unpaid' | 'paid';
        paymentMethod: 'COD' | 'card' | 'bank';
        total: number;
        createdAt: string;
        updatedAt: string;
        customer: { firstName: string; city: string };
        bankTransfer?: { status?: 'awaiting_proof' | 'proof_submitted' | 'approved' | 'rejected' };
      } | null;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const timeline = [
      { key: 'pending', label: 'Order placed', done: true },
      { key: 'confirmed', label: 'Order confirmed', done: ['confirmed', 'shipped', 'delivered'].includes(order.status) },
      { key: 'shipped', label: 'Shipped', done: ['shipped', 'delivered'].includes(order.status) },
      { key: 'delivered', label: 'Delivered', done: order.status === 'delivered' },
    ];

    if (order.status === 'cancelled') {
      timeline.push({ key: 'cancelled', label: 'Cancelled', done: true });
    }

    return NextResponse.json({
      order: {
        orderId: order.orderId,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        customerName: order.customer?.firstName ?? '',
        city: order.customer?.city ?? '',
        bankTransferStatus: order.bankTransfer?.status ?? '',
      },
      timeline,
    });
  } catch (err) {
    console.error('GET /api/orders/track error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
