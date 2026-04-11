'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import AppShell from '@/components/layout/AppShell';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import NewArrivalsSlider from '@/components/sections/NewArrivalsSlider';
import CategoryCards from '@/components/sections/CategoryCards';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
import { useSearchParams } from 'next/navigation';

function ShopContent() {
  const params = useSearchParams();
  const category = (params.get('category') ?? '').trim();
  const sort = (params.get('sort') ?? '').trim();
  const hasLegacyFilter = Boolean(category || sort);
  const dressesHref = `/dresses${category || sort ? `?${new URLSearchParams({ ...(category ? { category } : {}), ...(sort ? { sort } : {}) }).toString()}` : ''}`;

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
          {hasLegacyFilter && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.12em] text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Filtered browsing moved to Dresses page
              </p>
              <Link href={dressesHref} className="btn-luxury btn-outline mt-3 inline-block">
                Open Filtered Dresses
              </Link>
            </div>
          )}
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><p className="text-brown font-inter tracking-[0.2em] uppercase text-xs">Loading...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}
