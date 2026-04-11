import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80';

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

    const result = categories.map((c) => ({
      id: c.categoryId,
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || FALLBACK_IMAGE,
      isActive: c.isActive !== false,
      sortOrder: Number(c.sortOrder) || 0,
      count: countByCategory.get(c.name) ?? 0,
    }));

    return NextResponse.json({ categories: result });
  } catch (err) {
    console.error('GET /api/categories error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

