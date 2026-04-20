import DressesCatalog from '@/components/storefront/DressesCatalog';
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/storefrontData';
import { redirect } from 'next/navigation';
import { SITE_ORIGIN } from '@/lib/siteUrl';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE_ORIGIN}/dresses`,
  },
};

export const dynamic = 'force-dynamic';

export default async function DressesPage({ searchParams }: { searchParams?: { category?: string; sort?: string } }) {
  if ((searchParams?.category ?? '').trim().toLowerCase() === 'one piece') {
    redirect('/signature-dress');
  }

  const [products, initialCategories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);

  const regularProducts = products.filter((product) => !product.isSignatureDress);

  return <DressesCatalog initialProducts={regularProducts} initialCategories={initialCategories} />;
}
