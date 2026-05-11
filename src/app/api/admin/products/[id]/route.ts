import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
    
    // Build update object based on what was actually sent
    const update: any = {};
    
    if (body.name !== undefined) update.name = body.name;
    if (body.category !== undefined) update.category = body.category;
    if (body.price !== undefined) update.price = Number(body.price);
    if (body.originalPrice !== undefined) update.originalPrice = Number(body.originalPrice);
    if (body.costPrice !== undefined) update.costPrice = Number(body.costPrice);
    if (body.stock !== undefined) update.stock = Number(body.stock);
    if (body.images !== undefined) update.images = asStringArray(body.images);
    if (body.frontImageUrl !== undefined) update.frontImageUrl = String(body.frontImageUrl).trim();
    if (body.backImageUrl !== undefined) update.backImageUrl = String(body.backImageUrl).trim();
    if (body.sizeChartImageUrl !== undefined) update.sizeChartImageUrl = String(body.sizeChartImageUrl).trim();
    if (body.videoUrl !== undefined) update.videoUrl = String(body.videoUrl).trim();
    if (body.model3dUrl !== undefined) update.model3dUrl = String(body.model3dUrl).trim();
    if (body.model3dStatus !== undefined) {
      update.model3dStatus = ['ready', 'pending', 'failed', 'none'].includes(body.model3dStatus) ? body.model3dStatus : 'none';
    }
    if (body.model3dError !== undefined) update.model3dError = String(body.model3dError);
    if (body.description !== undefined) update.description = body.description;
    if (body.details !== undefined) update.details = asStringArray(body.details);
    if (body.sizes !== undefined) update.sizes = asSizes(body.sizes);
    if (body.sizeChartRows !== undefined) update.sizeChartRows = asFilteredSizeChartRows(body.sizeChartRows);
    if (body.colors !== undefined) update.colors = asColors(body.colors);
    if (body.rating !== undefined) update.rating = Number(body.rating);
    if (body.reviewCount !== undefined) update.reviewCount = Number(body.reviewCount);
    if (body.tags !== undefined) update.tags = asStringArray(body.tags);
    if (body.isActive !== undefined) update.isActive = body.isActive !== false;
    if (body.outOfStock !== undefined) update.outOfStock = body.outOfStock === true;
    if (body.isNewArrival !== undefined) update.isNewArrival = !!body.isNewArrival;
    if (body.isSale !== undefined) update.isSale = !!body.isSale;
    if (body.isBestseller !== undefined) update.isBestseller = !!body.isBestseller;
    if (body.isSignatureDress !== undefined) update.isSignatureDress = body.isSignatureDress === true;
    if (body.isHomeCarousel !== undefined) update.isHomeCarousel = body.isHomeCarousel === true;
    if (body.fabric !== undefined) update.fabric = String(body.fabric).trim();
    if (body.craft !== undefined) update.craft = String(body.craft).trim();
    if (body.line !== undefined) update.line = String(body.line).trim();
    if (body.lovedByCount !== undefined) update.lovedByCount = Number(body.lovedByCount);

    const product = await Product.findOneAndUpdate(
      query,
      { $set: update },
      { new: true }
    );


    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    revalidatePath('/', 'layout');

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

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/products/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
