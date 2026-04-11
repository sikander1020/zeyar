import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ categories });
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
