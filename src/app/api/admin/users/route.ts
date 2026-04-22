import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const users = await User.find({}, {
      firstName: 1,
      lastName: 1,
      email: 1,
      phone: 1,
      role: 1,
      createdAt: 1,
    })
      .sort({ createdAt: -1 })
      .lean();

    const result = users.map((u) => ({
      userId: String(u._id ?? ''),
      firstName: u.firstName ?? '',
      lastName: u.lastName ?? '',
      email: u.email ?? '',
      phone: u.phone ?? '',
      role: u.role ?? 'customer',
      createdAt: u.createdAt ?? null,
    }));

    return NextResponse.json({ users: result });
  } catch (err) {
    console.error('GET /api/admin/users error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
