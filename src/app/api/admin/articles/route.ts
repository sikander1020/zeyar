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

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const articles = await Article.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();

  const slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const article = await Article.create({
    title: body.title,
    slug: `${slug}-${Date.now()}`,
    tag: body.tag ?? 'Editorial',
    excerpt: body.excerpt ?? '',
    body: body.body ?? '',
    coverImage: body.coverImage ?? '',
    readTime: body.readTime ?? '3 min read',
    isPublished: body.isPublished ?? false,
    publishedAt: body.isPublished ? new Date() : null,
  });

  return NextResponse.json({ article }, { status: 201 });
}
