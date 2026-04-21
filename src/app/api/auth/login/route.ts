import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyPassword, signJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT
    const token = signJWT({ id: user._id.toString(), email: user.email, role: user.role });
    
    // Merge local wishlist array (if any were passed up when logging in)
    // Front-end could send local wishlist up during login
    
    const res = NextResponse.json({ 
      success: true, 
      user: { id: user._id.toString(), firstName: user.firstName, lastName: user.lastName, email: user.email } 
    });
    
    res.cookies.set('zaybaash_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    return res;
  } catch (err: any) {
    console.error('Login Error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
