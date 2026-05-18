import DressesCatalog from '@/components/storefront/DressesCatalog';
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/storefrontData';
import { redirect } from 'next/navigation';
import { SITE_ORIGIN } from '@/lib/siteUrl';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Women\'s Dresses — Buy Premium Dresses Online in Pakistan',
  description: 'Shop ZAYBAASH\'s exclusive collection of premium women\'s dresses in Pakistan. Elegant two-piece suits, stylish kurtas, and designer fashion. Delivered to Islamabad, Lahore, Karachi & beyond. COD available.',
  alternates: {
    canonical: `${SITE_ORIGIN}/dresses`,
  },
  openGraph: {
    title: 'Women\'s Dresses — Buy Premium Dresses Online | ZAYBAASH Pakistan',
    description: 'Explore a curated range of luxury women\'s dresses. Two-piece suits, designer wear and more — with fast delivery across Pakistan.',
    url: `${SITE_ORIGIN}/dresses`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZAYBAASH Women\'s Dresses Collection',
      },
    ],
  },
};

// ISR: page is statically generated and cached at CDN edge, revalidated every 5 min
export const revalidate = 300;


export default async function DressesPage({ searchParams }: { searchParams?: { category?: string; sort?: string } }) {
  const requestedCategory = (searchParams?.category ?? '').trim().toLowerCase();
  if (requestedCategory === 'one piece' || requestedCategory.includes('signature')) {
    redirect('/signature-dress');
  }

  const [products, initialCategories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);

  const regularProducts = products.filter((product) => !product.isSignatureDress);
  const regularCategories = initialCategories.filter(
    (category) => !category.name.toLowerCase().includes('signature')
  );

  return <DressesCatalog initialProducts={regularProducts} initialCategories={regularCategories} />;
}
