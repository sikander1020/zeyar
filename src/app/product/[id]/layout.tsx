import { Metadata } from 'next';
import { cache } from 'react';
import { SITE_ORIGIN } from '@/lib/siteUrl';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

type ProductSeoDoc = {
  productId: string;
  name: string;
  category?: string;
  description?: string;
  images?: string[];
  frontImageUrl?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  outOfStock?: boolean;
  updatedAt?: Date | string;
};

function normalizeImageUrl(input?: string): string {
  const value = (input ?? '').trim();
  if (!value) return `${SITE_ORIGIN}/og-image.png`;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `${SITE_ORIGIN}${value.startsWith('/') ? value : `/${value}`}`;
}

const getProductSeoData = cache(async (productId: string): Promise<ProductSeoDoc | null> => {
  if (!productId) return null;

  await connectDB();
  const product = await Product.findOne({ productId, isActive: { $ne: false } })
    .select('productId name category description images frontImageUrl price originalPrice rating reviewCount outOfStock updatedAt')
    .lean<ProductSeoDoc | null>();

  return product;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const productId = String(id ?? '').trim();
  const productUrl = `${SITE_ORIGIN}/product/${encodeURIComponent(productId)}`;

  let title = 'Product Details';
  let description = 'Shop premium ZAYBAASH pieces with live catalog pricing and availability.';
  let imageUrl = `${SITE_ORIGIN}/og-image.png`;

  if (productId) {
    try {
      const product = await getProductSeoData(productId);

      if (product?.name) {
        title = `${product.name} — Buy Online in Pakistan`;
        description = (product.description ?? '').trim() || `Shop ${product.name} by ZAYBAASH. Premium ${product.category ?? 'women\'s fashion'} with nationwide delivery in Pakistan.`;
        imageUrl = normalizeImageUrl(product.frontImageUrl || product.images?.[0]);
      }
    } catch {
      // Keep fallback metadata when DB is unavailable.
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `ZAYBAASH | ${title}`,
      description,
      url: productUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `ZAYBAASH | ${title}`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = String(id ?? '').trim();
  const productUrl = `${SITE_ORIGIN}/product/${encodeURIComponent(productId)}`;

  let productJsonLd: Record<string, unknown> | null = null;
  let breadcrumbJsonLd: Record<string, unknown> | null = null;

  if (productId) {
    try {
      const product = await getProductSeoData(productId);
      if (product?.name) {
        const imageUrl = normalizeImageUrl(product.frontImageUrl || product.images?.[0]);
        const reviewCount = Number(product.reviewCount) || 0;
        const ratingValue = Number(product.rating) || 0;
        const priceValue = Number(product.price) || 0;

        productJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          sku: product.productId,
          image: [imageUrl],
          description: (product.description ?? '').trim() || `Premium women's fashion by ZAYBAASH in Pakistan.`,
          brand: {
            '@type': 'Brand',
            name: 'ZAYBAASH',
          },
          category: product.category ?? 'Women\'s Fashion',
          offers: {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: 'PKR',
            price: priceValue,
            availability: product.outOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: {
              '@type': 'Organization',
              name: 'ZAYBAASH',
            },
          },
          ...(reviewCount > 0 && ratingValue > 0
            ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: Number(ratingValue.toFixed(1)),
                  reviewCount,
                },
              }
            : {}),
        };

        breadcrumbJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: SITE_ORIGIN,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Shop',
              item: `${SITE_ORIGIN}/shop`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: productUrl,
            },
          ],
        };
      }
    } catch {
      // Ignore structured data generation errors.
    }
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
