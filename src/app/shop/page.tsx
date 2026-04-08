'use client';

import AppShell from '@/components/layout/AppShell';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import NewArrivalsSlider from '@/components/sections/NewArrivalsSlider';
import CategoryCards from '@/components/sections/CategoryCards';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';

export default function ShopPage() {
  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        {/* Page Header */}
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

        <FeaturedCollections />
        <NewArrivalsSlider />
        <CategoryCards />
        <Testimonials />
        <Newsletter />
      </div>
    </AppShell>
  );
}
