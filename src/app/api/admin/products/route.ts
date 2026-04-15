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

function asSizeChartRows(value: unknown): Array<{ size: string; chest: number; waist: number; hips: number; length: number }> {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => {
      if (!v || typeof v !== 'object') return null;
      const row = v as Record<string, unknown>;
      const size = typeof row.size === 'string' ? row.size.trim() : '';
      const chest = Number(row.chest);
      const waist = Number(row.waist);
      const hips = Number(row.hips);
      const length = Number(row.length);
      if (!size || !Number.isFinite(chest) || !Number.isFinite(waist) || !Number.isFinite(hips) || !Number.isFinite(length)) {
        return null;
      }
      return { size, chest, waist, hips, length };
    })
    .filter((v): v is { size: string; chest: number; waist: number; hips: number; length: number } => !!v);
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
    const sizeChartRows = asSizeChartRows(body.sizeChartRows);
    const frontImageUrl = typeof body.frontImageUrl === 'string' ? body.frontImageUrl.trim() : '';
    const backImageUrl = typeof body.backImageUrl === 'string' ? body.backImageUrl.trim() : '';

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
      sizeChartRows,
      colors,
      rating: Number(body.rating) || 4.8,
      reviewCount: Number(body.reviewCount) || 0,
      tags,
      frontImageUrl,
      backImageUrl,
      model3dUrl: typeof body.model3dUrl === 'string' ? body.model3dUrl.trim() : '',
      model3dStatus: body.model3dStatus === 'ready' ? 'ready' : 'none',
      model3dError: '',
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
