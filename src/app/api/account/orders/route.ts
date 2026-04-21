import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { User } from '@/models/User';
import { verifyJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('zaybaash_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyJWT(token);
    if (!payload || !payload.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(payload.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const orders = await Order.find({ 'customer.email': user.email.toLowerCase() }).sort({ createdAt: -1 });
    
    return NextResponse.json(orders);
  } catch (err) {
    console.error('Account orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
