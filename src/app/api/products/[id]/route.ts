import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80';
const BLOCKED_SIZES = new Set(['XS', 'XL', 'EXTRA SMALL', 'EXTRA LARGE']);

function sanitizeSizes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const filtered = value
    .map((v) => (typeof v === 'string' ? v.trim() : ''))
    .filter((size) => size.length > 0)
    .filter((size) => !BLOCKED_SIZES.has(size.toUpperCase()));

  return filtered;
}

function sanitizeSizeChartRows(value: unknown): Array<{ size: string; chest: number; waist: number; hips: number; length: number }> {
  if (!Array.isArray(value)) return [];

  return value
    .filter((row): row is { size?: unknown; chest?: unknown; waist?: unknown; hips?: unknown; length?: unknown } => Boolean(row) && typeof row === 'object')
    .map((row) => {
      const size = typeof row.size === 'string' ? row.size.trim() : '';
      const chest = Number(row.chest);
      const waist = Number(row.waist);
      const hips = Number(row.hips);
      const length = Number(row.length);

      if (!size || BLOCKED_SIZES.has(size.toUpperCase())) return null;
      if (!Number.isFinite(chest) || !Number.isFinite(waist) || !Number.isFinite(hips) || !Number.isFinite(length)) {
        return null;
      }

      return { size, chest, waist, hips, length };
    })
    .filter((row): row is { size: string; chest: number; waist: number; hips: number; length: number } => Boolean(row));
}

function normalizeProduct(p: {
  _id?: unknown;
  productId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  frontImageUrl?: string;
  backImageUrl?: string;
  sizeChartImageUrl?: string;
  videoUrl?: string;
  model3dUrl?: string;
  model3dStatus?: 'none' | 'pending' | 'ready' | 'failed';
  colors?: Array<{ name: string; hex: string }>;
  sizes?: string[];
  sizeChartRows?: Array<{ size: string; chest: number; waist: number; hips: number; length: number }>;
  description?: string;
  details?: string[];
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  stock?: number;
  isActive?: boolean;
  outOfStock?: boolean;
  isNewArrival?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
}) {
  const resolvedId = typeof p.productId === 'string' && p.productId.trim().length > 0
    ? p.productId.trim()
    : String(p._id ?? '').trim();
  const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : [FALLBACK_IMAGE];
  const colors = Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [{ name: 'Default', hex: '#E6B7A9' }];
  const sanitizedSizes = sanitizeSizes(p.sizes);
  const sizes = sanitizedSizes.length > 0 ? sanitizedSizes : ['S', 'M', 'L'];
  const sizeChartRows = sanitizeSizeChartRows(p.sizeChartRows);

  return {
    id: resolvedId,
    name: p.name,
    category: p.category,
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice,
    images,
    frontImageUrl: typeof p.frontImageUrl === 'string' ? p.frontImageUrl : '',
    backImageUrl: typeof p.backImageUrl === 'string' ? p.backImageUrl : '',
    sizeChartImageUrl: typeof p.sizeChartImageUrl === 'string' ? p.sizeChartImageUrl : '',
    videoUrl: typeof p.videoUrl === 'string' ? p.videoUrl : '',
    model3dUrl: typeof p.model3dUrl === 'string' ? p.model3dUrl : '',
    model3dStatus: p.model3dStatus ?? 'none',
    colors,
    sizes,
    sizeChartRows,
    description: p.description ?? '',
    details: Array.isArray(p.details) ? p.details : [],
    rating: Number(p.rating) || 4.8,
    reviewCount: Number(p.reviewCount) || 0,
    tags: Array.isArray(p.tags) ? p.tags : [],
    stock: Number(p.stock) || 0,
    isActive: p.isActive !== false,
    outOfStock: p.outOfStock === true,
    isNew: p.isNewArrival === true,
    isSale: p.isSale === true,
    isBestseller: p.isBestseller === true,
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const pid = decodeURIComponent(String(id ?? '').trim());
    if (!pid) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let doc = await Product.findOne({ productId: pid, isActive: { $ne: false } }).lean();
    if (!doc && mongoose.Types.ObjectId.isValid(pid)) {
      doc = await Product.findOne({ _id: new mongoose.Types.ObjectId(pid), isActive: { $ne: false } }).lean();
    }
    if (!doc) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { product: normalizeProduct(doc as never) },
      { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300' } },
    );
  } catch (err) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
