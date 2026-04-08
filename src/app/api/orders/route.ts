import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

// Generate a short readable order ID
function generateOrderId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}-${rand}`;
}

// POST /api/orders — place a new order
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      customer, items, subtotal, discount = 0, total,
      paymentMethod = 'COD',
    } = body;

    if (!customer || !items?.length || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const order = await Order.create({
      orderId: generateOrderId(),
      customer,
      items,
      subtotal,
      discount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'unpaid' : 'paid',
      status: 'pending',
    });

    return NextResponse.json({ success: true, orderId: order.orderId }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/orders — list all orders (admin use)
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
