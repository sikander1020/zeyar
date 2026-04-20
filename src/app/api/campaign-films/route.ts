import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CampaignFilm } from '@/models/CampaignFilm';

export const revalidate = 60; // 1 min cache

export async function GET() {
  try {
    await connectDB();
    const films = await CampaignFilm.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(films);
  } catch (err) {
    console.error('GET /api/campaign-films error:', err);
    return NextResponse.json({ error: 'Failed to fetch films' }, { status: 500 });
  }
}
