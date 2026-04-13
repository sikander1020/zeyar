import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();

    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = new Map<string, number>(
      counts.map((r) => [String(r._id ?? ''), Number(r.count) || 0]),
    );

    let result = categories.map((c) => ({
      categoryId: c.categoryId || String(c._id ?? ''),
      name: c.name,
      description: c.description || '',
      slug: c.slug || String(c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: c.image || '',
      isActive: c.isActive !== false,
      sortOrder: Number(c.sortOrder) || 0,
      productCount: countMap.get(c.name) ?? Number(c.productCount) || 0,
    }));

    if (result.length === 0 && countMap.size > 0) {
      result = Array.from(countMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count], i) => ({
          categoryId: `cat_${String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name,
          description: `${name} collection`,
          slug: String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          image: '',
          isActive: true,
          sortOrder: i,
          productCount: count,
        }));
    }

    return NextResponse.json({ categories: result });
  } catch (err) {
    console.error('GET /api/admin/categories error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const body = await req.json();

    const category = new Category({
      categoryId: `cat_${Date.now()}`,
      name: body.name,
      description: body.description || '',
      image: body.image || '',
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      isActive: body.isActive !== false,
      sortOrder: body.sortOrder || 0,
    });

    await category.save();
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/categories error:', err);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
