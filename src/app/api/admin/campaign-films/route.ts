import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CampaignFilm } from '@/models/CampaignFilm';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const films = await CampaignFilm.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(films);
  } catch (err) {
    console.error('GET /api/admin/campaign-films error:', err);
    return NextResponse.json({ error: 'Failed to fetch films' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const body = await req.json();
    const newFilm = await CampaignFilm.create(body);
    return NextResponse.json(newFilm, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/campaign-films error:', err);
    return NextResponse.json({ error: 'Failed to create film' }, { status: 500 });
  }
}
