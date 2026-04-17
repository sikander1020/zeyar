import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';

const BLOCKED_SIZES = new Set(['XS', 'XL', 'EXTRA SMALL', 'EXTRA LARGE']);

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

function asSizes(value: unknown): string[] {
  return asStringArray(value).filter((size) => !BLOCKED_SIZES.has(size.toUpperCase()));
}

function asFilteredSizeChartRows(value: unknown): Array<{ size: string; chest: number; waist: number; hips: number; length: number }> {
  return asSizeChartRows(value).filter((row) => !BLOCKED_SIZES.has(row.size.toUpperCase()));
}

function findProductQuery(id: string) {
  const normalizedId = String(id ?? '').trim();
  if (mongoose.Types.ObjectId.isValid(normalizedId)) {
    return {
      $or: [
        { productId: normalizedId },
        { _id: new mongoose.Types.ObjectId(normalizedId) },
      ],
    };
  }
  return { productId: normalizedId };
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    await connectDB();
    const { id } = await params;
    const query = findProductQuery(id);
    const body = await req.json();
    const stock = Number(body.stock) || 0;
    const sizeChartImageUrl = typeof body.sizeChartImageUrl === 'string' ? body.sizeChartImageUrl.trim() : '';
    const videoUrl = typeof body.videoUrl === 'string' ? body.videoUrl.trim() : '';

    const product = await Product.findOneAndUpdate(
      query,
      {
        name: body.name,
        category: body.category,
        price: body.price,
        originalPrice: body.originalPrice,
        costPrice: body.costPrice,
        stock,
        images: asStringArray(body.images),
        frontImageUrl: typeof body.frontImageUrl === 'string' ? body.frontImageUrl.trim() : '',
        backImageUrl: typeof body.backImageUrl === 'string' ? body.backImageUrl.trim() : '',
        sizeChartImageUrl,
        videoUrl,
        model3dUrl: typeof body.model3dUrl === 'string' ? body.model3dUrl.trim() : '',
        model3dStatus: body.model3dStatus === 'ready' || body.model3dStatus === 'pending' || body.model3dStatus === 'failed' ? body.model3dStatus : 'none',
        model3dError: typeof body.model3dError === 'string' ? body.model3dError : '',
        description: body.description || '',
        details: asStringArray(body.details),
        sizes: asSizes(body.sizes),
        sizeChartRows: asFilteredSizeChartRows(body.sizeChartRows),
        colors: asColors(body.colors),
        rating: Number(body.rating) || 4.8,
        reviewCount: Number(body.reviewCount) || 0,
        tags: asStringArray(body.tags),
        isActive: body.isActive !== false,
        outOfStock: body.outOfStock === true,
        isNewArrival: body.isNewArrival,
        isSale: body.isSale,
        isBestseller: body.isBestseller,
        isSignatureDress: body.isSignatureDress === true,
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
    const query = findProductQuery(id);

    const product = await Product.findOneAndDelete(query);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
