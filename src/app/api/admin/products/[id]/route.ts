import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter(Boolean);
}

function asColors(value: unknown): Array<{ name: string; hex: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      if (!v || typeof v !== 'object') return null;
      const name = typeof (v as { name?: unknown }).name === 'string'
        ? (v as { name: string }).name.trim()
        : '';
      const hex = typeof (v as { hex?: unknown }).hex === 'string'
        ? (v as { hex: string }).hex.trim()
        : '';
      if (!name || !hex) return null;
      return { name, hex };
    })
    .filter((v): v is { name: string; hex: string } => !!v);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const stock = Number(body.stock) || 0;

    const product = await Product.findOneAndUpdate(
      { productId: id },
      {
        name: body.name,
        category: body.category,
        price: body.price,
        originalPrice: body.originalPrice,
        costPrice: body.costPrice,
        stock,
        images: asStringArray(body.images),
        description: body.description || '',
        details: asStringArray(body.details),
        sizes: asStringArray(body.sizes),
        colors: asColors(body.colors),
        rating: Number(body.rating) || 4.8,
        reviewCount: Number(body.reviewCount) || 0,
        tags: asStringArray(body.tags),
        isActive: body.isActive !== false,
        outOfStock: body.outOfStock === true,
        isNewArrival: body.isNewArrival,
        isSale: body.isSale,
        isBestseller: body.isBestseller,
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.error('PUT /api/admin/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const { id } = await params;

    const product = await Product.findOneAndDelete({ productId: id });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
