import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

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

    const orderId = generateOrderId();
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
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

        await Order.create([{
          orderId,
          customer,
          items,
          subtotal,
          discount,
          total,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'unpaid' : 'paid',
          status: 'pending',
        }], { session });
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.startsWith('INSUFFICIENT_STOCK:')) {
        return NextResponse.json(
          { error: 'One or more items are out of stock. Please refresh and try again.' },
          { status: 409 },
        );
      }
      throw e;
    } finally {
      await session.endSession();
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 });
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
