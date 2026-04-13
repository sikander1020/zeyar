import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/adminAuth';
import mongoose from 'mongoose';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ categoryId: id }, { _id: new mongoose.Types.ObjectId(id) }] }
      : { categoryId: id };

    const category = await Category.findOneAndUpdate(
      query,
      {
        name: body.name,
        description: body.description,
        image: body.image,
        slug: body.slug,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
      },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (err) {
    console.error('PUT /api/admin/categories/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const { id } = await params;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ categoryId: id }, { _id: new mongoose.Types.ObjectId(id) }] }
      : { categoryId: id };

    const category = await Category.findOneAndDelete(query);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/categories/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
