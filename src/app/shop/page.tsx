import AppShell from '@/components/layout/AppShell';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import NewArrivalsSlider from '@/components/sections/NewArrivalsSlider';
import CategoryCards from '@/components/sections/CategoryCards';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
import RecentlyViewedStrip from '@/components/sections/RecentlyViewedStrip';
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/storefrontData';
import type { StoreCategory, StoreProduct } from '@/types/storefront';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const [products, initialCategories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        <div className="bg-beige py-16 text-center mb-0">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            ZAYBAASH Collection
          </span>
          <h1 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop <span className="italic gradient-rose-text">All</span>
          </h1>
          <p className="mt-4 text-sm text-brown-muted font-inter max-w-md mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Discover our curated collections, new arrivals, and the stories behind each piece.
          </p>
        </div>

        <FeaturedCollections initialProducts={products} />
        <NewArrivalsSlider initialProducts={products} />
        <RecentlyViewedStrip products={products} />
        <CategoryCards initialCategories={initialCategories} />
        <Testimonials />
        <Newsletter />
      </div>
    </AppShell>
  );
}
