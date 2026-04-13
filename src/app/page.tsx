import AppShell from '@/components/layout/AppShell';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import NewArrivalsSlider from '@/components/sections/NewArrivalsSlider';
import CategoryCards from '@/components/sections/CategoryCards';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
import RecentlyViewedStrip from '@/components/sections/RecentlyViewedStrip';
import RevealOnScroll from '@/components/animation/RevealOnScroll';
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/storefrontData';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, initialCategories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);

  return (
    <AppShell>
      <HeroSection />
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
    </AppShell>
  );
}
