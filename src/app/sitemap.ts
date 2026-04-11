import { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_ORIGIN;
  
  const staticRoutes = ['', '/shop', '/dresses', '/about', '/wishlist', '/cart', '/size-guide', '/returns'].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const products = await Product.find({ isActive: true }).select('productId updatedAt').lean();
    dynamicRoutes = products.map((product) => ({
      url: `${base}/product/${product.productId}`,
      lastModified: new Date(product.updatedAt ?? Date.now()).toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch {
    dynamicRoutes = [];
  }

  return [...staticRoutes, ...dynamicRoutes];
}
