import DressesCatalog from '@/components/storefront/DressesCatalog';
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/storefrontData';
import type { StoreCategory, StoreProduct } from '@/types/storefront';

export const dynamic = 'force-dynamic';

export default async function DressesPage({ searchParams }: { searchParams?: { category?: string; sort?: string } }) {
  const [products, initialCategories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);

  return <DressesCatalog initialProducts={products} initialCategories={initialCategories} />;
}
