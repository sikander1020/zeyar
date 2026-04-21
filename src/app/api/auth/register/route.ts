import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashPassword, signJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json();
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    
    // Check if user exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Create JWT
    const token = signJWT({ id: user._id.toString(), email: user.email, role: user.role });
    
    const res = NextResponse.json({ 
      success: true, 
      user: { id: user._id.toString(), firstName: user.firstName, lastName: user.lastName, email: user.email } 
    });
    
    // Set HTTP-only cookie
    res.cookies.set('zaybaash_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    return res;
  } catch (err: any) {
    console.error('Registration Error:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
