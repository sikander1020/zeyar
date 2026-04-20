import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import type { StoreCategory, StoreProduct } from '@/types/storefront';

const BLOCKED_SIZES = new Set(['XS', 'XL', 'EXTRA SMALL', 'EXTRA LARGE']);

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
  'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
  'https://images.unsplash.com/photo-1464863979621-258859e62245?w=800&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
];
const FALLBACK_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80';

function stableIndex(seed: string, size: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return size > 0 ? hash % size : 0;
}

function fallbackProductImages(seed: string) {
  const first = stableIndex(seed, FALLBACK_IMAGES.length);
  const second = (first + 1) % FALLBACK_IMAGES.length;
  return [FALLBACK_IMAGES[first], FALLBACK_IMAGES[second]];
}

function sanitizeSizes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter((size) => size.length > 0)
    .filter((size) => !BLOCKED_SIZES.has(size.toUpperCase()));
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

function categoryKey(value: string) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function categoryDisplayName(value: string) {
  return categoryKey(value)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
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
  isSignatureDress?: boolean;
}): StoreProduct {
  const resolvedId = typeof p.productId === 'string' && p.productId.trim().length > 0
    ? p.productId.trim()
    : String(p._id ?? '').trim();

  const imageSeed = `${resolvedId}|${p.name}|${p.category}`;
  const safeImages = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
  const sizeChartRows = sanitizeSizeChartRows(p.sizeChartRows);
  const sizes = sanitizeSizes(p.sizes);
  const images = safeImages.length >= 2
    ? safeImages
    : safeImages.length === 1
      ? [safeImages[0], ...fallbackProductImages(imageSeed).slice(0, 1)]
      : fallbackProductImages(imageSeed);

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
    colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [{ name: 'Default', hex: '#E6B7A9' }],
    sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L'],
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
    isSignatureDress: p.isSignatureDress === true || (Array.isArray(p.tags) && p.tags.some((tag) => tag.trim().toLowerCase() === 'signature')),
  };
}

function normalizeCategory(c: {
  _id?: unknown;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}, count = 0): StoreCategory {
  const resolvedId = typeof c.categoryId === 'string' && c.categoryId.trim().length > 0
    ? c.categoryId.trim()
    : String(c._id ?? '').trim();

  return {
    id: resolvedId,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || FALLBACK_CATEGORY_IMAGE,
    isActive: c.isActive !== false,
    sortOrder: Number(c.sortOrder) || 0,
    count,
  };
}

const getRawProducts = unstable_cache(
  async () => {
    await connectDB();
    const docs = await Product.find({ isActive: { $ne: false } }).lean();
    return docs.map((doc) => normalizeProduct(doc as never));
  },
  ['storefront-products'],
  { revalidate: 15, tags: ['storefront-products'] },
);

const getRawCategories = unstable_cache(
  async () => {
    await connectDB();
    const categories = await Category.find({ isActive: { $ne: false } }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    const counts = await Product.aggregate([
      { $match: { isActive: { $ne: false } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = new Map<string, number>();
    for (const row of counts) {
      const key = categoryKey(String(row._id ?? ''));
      if (!key) continue;
      countMap.set(key, (countMap.get(key) ?? 0) + (Number(row.count) || 0));
    }

    let result: StoreCategory[];
    if (categories.length > 0) {
      const dedup = new Map<string, StoreCategory>();
      for (const c of categories) {
        const key = categoryKey(String(c.name || c.slug || ''));
        if (!key) continue;

        const normalized = normalizeCategory({
          _id: c._id,
          categoryId: String(c.categoryId || ''),
          name: categoryDisplayName(String(c.name || key)),
          slug: String(c.slug || key).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: c.description,
          image: c.image,
          isActive: c.isActive,
          sortOrder: c.sortOrder,
        }, countMap.get(key) ?? 0);

        const prev = dedup.get(key);
        if (!prev || normalized.sortOrder < prev.sortOrder) {
          dedup.set(key, normalized);
        }
      }
      result = Array.from(dedup.values()).sort((a, b) => a.sortOrder - b.sortOrder);
    } else {
      result = Array.from(countMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => normalizeCategory({
          categoryId: `cat_${String(key).replace(/[^a-z0-9]+/g, '-')}`,
          name: categoryDisplayName(key),
          slug: String(key).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }, count));
    }

    return result;
  },
  ['storefront-categories'],
  { revalidate: 15, tags: ['storefront-categories'] },
);

export async function getStorefrontProducts() {
  return getRawProducts();
}

export async function getStorefrontCategories() {
  return getRawCategories();
}