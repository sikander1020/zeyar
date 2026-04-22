import { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/dashboard/',
          '/account/',
          '/cart',
          '/checkout',
          '/payment-proof/',
          '/login',
          '/connect',
        ],
      },
      {
        // Block image optimisation crawlers from sensitive paths
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
