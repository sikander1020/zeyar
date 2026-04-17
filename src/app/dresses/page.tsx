import DressesCatalog from '@/components/storefront/DressesCatalog';
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/storefrontData';
import type { StoreCategory, StoreProduct } from '@/types/storefront';
import { redirect } from 'next/navigation';

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
