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

export async function GET(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch (err) {
    console.error('GET /api/admin/products error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const body = await req.json();
    const stock = Number(body.stock) || 0;
    const images = asStringArray(body.images);
    const sizes = asStringArray(body.sizes);
    const details = asStringArray(body.details);
    const tags = asStringArray(body.tags);
    const colors = asColors(body.colors);

    const product = new Product({
      productId: `prod_${Date.now()}`,
      name: body.name,
      category: body.category,
      price: body.price,
      originalPrice: body.originalPrice,
      costPrice: body.costPrice,
      stock,
      sold: 0,
      images,
      description: body.description || '',
      details,
      sizes,
      colors,
      rating: Number(body.rating) || 4.8,
      reviewCount: Number(body.reviewCount) || 0,
      tags,
      isActive: body.isActive !== false,
      outOfStock: body.outOfStock === true,
      isNewArrival: body.isNewArrival || false,
      isSale: body.isSale || false,
      isBestseller: body.isBestseller || false,
    });

    await product.save();
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/products error:', err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
