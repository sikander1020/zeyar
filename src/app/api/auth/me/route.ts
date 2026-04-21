import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('zaybaash_token')?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload = verifyJWT(token);
    if (!payload || !payload.id) return NextResponse.json({ user: null });

    await connectDB();
    const user = await User.findById(payload.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ 
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist,
        role: user.role,
      } 
    });
  } catch (err) {
    console.error('Auth /me error:', err);
    return NextResponse.json({ user: null });
  }
}

export async function DELETE(req: NextRequest) {
  // Logout route
  const res = NextResponse.json({ success: true });
  res.cookies.delete('zaybaash_token');
  return res;
}
