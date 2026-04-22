import { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_ORIGIN;
  const now = new Date().toISOString();

  // ─── Priority tiers ───────────────────────────────────────────────────────
  // Tier 1 (1.0) — Homepage: most important page for ranking
  // Tier 2 (0.9) — Core shopping pages: highest commercial intent
  // Tier 3 (0.8) — Brand/editorial pages
  // Tier 4 (0.6) — Support/info pages
  // Tier 5 (0.3) — Legal pages (low-value for ranking)

  const homePage: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  const coreShoppingPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/dresses`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${base}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/signature-dress`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  const brandPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
  ];

  const supportPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/size-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    {
      url: `${base}/returns`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/track-order`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/cookie-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // ─── Dynamic product pages ────────────────────────────────────────────────
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .select('productId updatedAt name')
      .lean();

    dynamicRoutes = products.map((product) => ({
      url: `${base}/product/${product.productId}`,
      lastModified: new Date(product.updatedAt ?? Date.now()).toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch {
    dynamicRoutes = [];
  }

  return [
    ...homePage,
    ...coreShoppingPages,
    ...dynamicRoutes,
    ...brandPages,
    ...supportPages,
    ...legalPages,
  ];
}
