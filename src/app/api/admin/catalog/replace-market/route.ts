import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { revalidateTag } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Review from '@/models/Review';
import { marketCatalogCategories, marketCatalogProducts } from '@/lib/marketCatalog';

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const body = await req.json().catch(() => ({})) as { confirm?: string };
    if (String(body.confirm ?? '') !== 'REPLACE_WITH_MARKET_CATALOG') {
      return NextResponse.json({ error: 'Missing confirmation' }, { status: 400 });
    }

    await connectDB();

    const session = await mongoose.startSession();
    const result = await session.withTransaction(async () => {
      const existingProducts = await Product.countDocuments().session(session);
      const existingCategories = await Category.countDocuments().session(session);

      await Review.deleteMany({}).session(session);
      await Product.deleteMany({}).session(session);
      await Category.deleteMany({}).session(session);

      const now = new Date();
      await Category.insertMany(
        marketCatalogCategories.map((category) => ({
          ...category,
          productCount: marketCatalogProducts.filter((p) => p.category === category.name).length,
          createdAt: now,
          updatedAt: now,
        })),
        { session },
      );

      await Product.insertMany(
        marketCatalogProducts.map((product) => ({
          ...product,
          createdAt: now,
          updatedAt: now,
        })),
        { session },
      );

      return {
        productsDeleted: existingProducts,
        categoriesDeleted: existingCategories,
        productsInserted: marketCatalogProducts.length,
        categoriesInserted: marketCatalogCategories.length,
      };
    });
    await session.endSession();

    revalidateTag('storefront-products', 'max');
    revalidateTag('storefront-categories', 'max');

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('POST /api/admin/catalog/replace-market error:', err);
    return NextResponse.json({ error: 'Failed to replace catalog' }, { status: 500 });
  }
}
