import AppShell from '@/components/layout/AppShell';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import NewArrivalsSlider from '@/components/sections/NewArrivalsSlider';
import CategoryCards from '@/components/sections/CategoryCards';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
import RecentlyViewedStrip from '@/components/sections/RecentlyViewedStrip';
import ShopHeroMotion from '@/components/sections/ShopHeroMotion';
import ShopHashScroll from '@/components/sections/ShopHashScroll';
import RevealOnScroll from '@/components/animation/RevealOnScroll';
import SignatureDressSpotlight from '@/components/storefront/SignatureDressSpotlight';
import { getStorefrontCategories, getStorefrontProducts } from '@/lib/storefrontData';
import { SITE_ORIGIN } from '@/lib/siteUrl';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Women\'s Fashion — Dresses, Suits & More',
  description: 'Browse the full ZAYBAASH collection. Shop premium women\'s dresses, two-piece suits, one-piece statement pieces, and signature handcrafted fashion. Cash on Delivery available across Pakistan.',
  alternates: {
    canonical: `${SITE_ORIGIN}/shop`,
  },
  openGraph: {
    title: 'Shop ZAYBAASH — Premium Women\'s Fashion Pakistan',
    description: 'Discover our full collection of luxury dresses, two-piece suits and signature pieces. Fast delivery across Pakistan. COD available.',
    url: `${SITE_ORIGIN}/shop`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZAYBAASH Shop — Women\'s Fashion Pakistan',
      },
    ],
  },
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const [products, initialCategories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);
  const signatureProducts = products.filter((p) => p.isSignatureDress);

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        <ShopHashScroll />
        <ShopHeroMotion />

        <RevealOnScroll>
          <div className="max-w-7xl mx-auto px-6 pt-8">
            <SignatureDressSpotlight products={signatureProducts} />
          </div>
        </RevealOnScroll>

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
