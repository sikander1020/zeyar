import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/models/Article';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 6), 20);

    const articles = await Article.find({ isPublished: true })
      .select('title slug tag excerpt coverImage readTime publishedAt')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(
      { articles },
      { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } }
    );
  } catch (err) {
    console.error('GET /api/articles error:', err);
    return NextResponse.json({ articles: [] });
  }
}
