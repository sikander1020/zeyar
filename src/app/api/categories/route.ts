import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80';

export const revalidate = 300; // 5 min cache


export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: { $ne: false } })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    const counts = await Product.aggregate([
      { $match: { isActive: { $ne: false } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countByCategory = new Map<string, number>(
      counts.map((r) => [String(r._id ?? ''), Number(r.count) || 0]),
    );

    let result = categories.map((c) => ({
      id: c.categoryId || String(c._id ?? ''),
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || FALLBACK_IMAGE,
      isActive: c.isActive !== false,
      sortOrder: Number(c.sortOrder) || 0,
      count: countByCategory.get(c.name) ?? 0,
    }));

    const dedup = new Map<string, typeof result[0]>();

    for (const c of result) {
      dedup.set(c.name, c);
    }

    for (const [name, count] of countByCategory.entries()) {
      if (!dedup.has(name) && count > 0) {
        dedup.set(name, {
          id: `cat_${String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name,
          slug: String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: `${name} collection`,
          image: FALLBACK_IMAGE,
          isActive: true,
          sortOrder: 999, // push dynamically created ones to the end
          count,
        });
      }
    }

    result = Array.from(dedup.values())
      .filter((c) => c.count > 0)
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return b.count - a.count;
      });

    return NextResponse.json(
      { categories: result },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (err) {
    console.error('GET /api/categories error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

