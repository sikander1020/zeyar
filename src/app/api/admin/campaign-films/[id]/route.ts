import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CampaignFilm } from '@/models/CampaignFilm';
import { requireAdmin } from '@/lib/adminAuth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    await CampaignFilm.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/campaign-films/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete film' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const body = await req.json();
    const updated = await CampaignFilm.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('PUT /api/admin/campaign-films/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update film' }, { status: 500 });
  }
}
