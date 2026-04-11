import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80';

function normalizeProduct(p: {
  productId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  colors?: Array<{ name: string; hex: string }>;
  sizes?: string[];
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
  const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : [FALLBACK_IMAGE];
  const colors = Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [{ name: 'Default', hex: '#E6B7A9' }];
  const sizes = Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L'];

  return {
    id: p.productId,
    name: p.name,
    category: p.category,
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice,
    images,
    colors,
    sizes,
    description: p.description ?? '',
    details: Array.isArray(p.details) ? p.details : [],
    rating: Number(p.rating) || 4.8,
    reviewCount: Number(p.reviewCount) || 0,
    tags: Array.isArray(p.tags) ? p.tags : [],
    stock: Number(p.stock) || 0,
    isActive: p.isActive !== false,
    outOfStock: p.outOfStock === true || (Number(p.stock) || 0) <= 0,
    isNew: p.isNewArrival === true,
    isSale: p.isSale === true,
    isBestseller: p.isBestseller === true,
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const doc = await Product.findOne({ productId: id, isActive: { $ne: false } }).lean();
    if (!doc) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { product: normalizeProduct(doc as never) },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    );
  } catch (err) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
