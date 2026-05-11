import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/models/Article';

function verifyAdmin(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token') ?? '';
  const ts = Number(req.headers.get('x-admin-ts') ?? '0');
  const adminPass = process.env.ADMIN_PASSWORD ?? '';
  const expected = Buffer.from(`${adminPass}:${ts}`).toString('base64');
  return token === expected && Date.now() - ts < 24 * 60 * 60 * 1000;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  if (body.isPublished && !body.publishedAt) {
    body.publishedAt = new Date();
  }

  const article = await Article.findByIdAndUpdate(id, body, { new: true });
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ article });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id } = await params;
  await Article.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
