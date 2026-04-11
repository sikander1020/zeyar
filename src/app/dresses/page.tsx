import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import DressesCatalog from '@/components/storefront/DressesCatalog';
import type { StoreCategory, StoreProduct } from '@/types/storefront';

export const dynamic = 'force-dynamic';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80';
const FALLBACK_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80';

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
}): StoreProduct {
  return {
    id: p.productId,
    name: p.name,
    category: p.category,
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [FALLBACK_IMAGE],
    colors: Array.isArray(p.colors) && p.colors.length > 0 ? p.colors : [{ name: 'Default', hex: '#E6B7A9' }],
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L'],
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

function normalizeCategory(c: {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
}, count = 0): StoreCategory {
  return {
    id: c.categoryId,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || FALLBACK_CATEGORY_IMAGE,
    isActive: c.isActive !== false,
    sortOrder: Number(c.sortOrder) || 0,
    count,
  };
}

export default async function DressesPage({ searchParams }: { searchParams?: { category?: string; sort?: string } }) {
  await connectDB();

  const products = (await Product.find({ isActive: { $ne: false } }).lean()).map((p) => normalizeProduct(p as never));
  const categories = await Category.find({ isActive: { $ne: false } }).sort({ sortOrder: 1, createdAt: -1 }).lean();
  const counts = await Product.aggregate([
    { $match: { isActive: { $ne: false } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap = new Map<string, number>(counts.map((r) => [String(r._id ?? ''), Number(r.count) || 0]));
  const initialCategories = categories.length > 0
    ? categories.map((c) => normalizeCategory(c as never, countMap.get(c.name) ?? 0))
    : Array.from(countMap.entries()).sort((a, b) => b[1] - a[1]).map(([name, count], i) => normalizeCategory({ categoryId: `cat_${i}`, name, slug: String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-') }, count));

  return <DressesCatalog initialProducts={products} initialCategories={initialCategories} />;
}
