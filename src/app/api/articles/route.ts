import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/models/Article';

export const revalidate = 300; // 5 min cache


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
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (err) {
    console.error('GET /api/articles error:', err);
    return NextResponse.json({ articles: [] });
  }
}
