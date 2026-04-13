import AppShell from '@/components/layout/AppShell';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import NewArrivalsSlider from '@/components/sections/NewArrivalsSlider';
import CategoryCards from '@/components/sections/CategoryCards';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
import RecentlyViewedStrip from '@/components/sections/RecentlyViewedStrip';
import ShopHeroMotion from '@/components/sections/ShopHeroMotion';
import RevealOnScroll from '@/components/animation/RevealOnScroll';
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
        <ShopHeroMotion />

        <RevealOnScroll>
          <FeaturedCollections initialProducts={products} />
        </RevealOnScroll>
        <RevealOnScroll delay={0.05}>
          <NewArrivalsSlider initialProducts={products} />
        </RevealOnScroll>
        <RevealOnScroll delay={0.08}>
          <RecentlyViewedStrip products={products} />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <CategoryCards initialCategories={initialCategories} />
        </RevealOnScroll>
        <RevealOnScroll delay={0.12}>
          <Testimonials />
        </RevealOnScroll>
        <RevealOnScroll delay={0.14}>
          <Newsletter />
        </RevealOnScroll>
      </div>
    </AppShell>
  );
}
