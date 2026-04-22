import type { Metadata } from 'next';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import HeroSection from '@/components/sections/HeroSection';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: {
    absolute: 'ZAYBAASH',
  },
  description: "ZAYBAASH official store for premium women's fashion in Pakistan. Shop one-piece dresses, two-piece suits, and signature handcrafted styles with nationwide delivery.",
  keywords: [
    'ZAYBAASH',
    'Zaybaash official store',
    'women fashion Pakistan',
    'premium dresses Pakistan',
    'one piece dresses',
    'two piece suits',
  ],
  alternates: {
    canonical: SITE_ORIGIN,
  },
  openGraph: {
    title: 'ZAYBAASH | Official Store',
    description: "Shop premium women's fashion by ZAYBAASH in Pakistan. Discover one-piece dresses, two-piece suits, and signature handcrafted styles.",
    url: SITE_ORIGIN,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZAYBAASH — Beauty with Style in Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZAYBAASH | Official Store',
    description: "Premium women's fashion by ZAYBAASH in Pakistan. Shop one-piece dresses, two-piece suits, and signature handcrafted styles.",
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  return (
    <AppShell>
      <HeroSection />

      <section className="bg-cream border-t border-nude/20 py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs tracking-[0.22em] uppercase text-rose-gold mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Premium Women&apos;s Fashion in Pakistan
          </p>
          <h2 className="text-3xl md:text-4xl text-brown font-playfair leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Buy Women&apos;s Dresses Online in Pakistan from ZAYBAASH
          </h2>
          <div className="space-y-4 text-sm md:text-base text-brown-muted leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            <p>
              ZAYBAASH is the official destination for premium women&apos;s fashion in Pakistan. Explore elegant one-piece dresses,
              tailored two-piece suits, and signature handcrafted styles designed for modern Pakistani women.
            </p>
            <p>
              Shop confidently with nationwide delivery, reliable support, and carefully curated seasonal collections. Whether
              you are looking for formal wear, event-ready outfits, or timeless everyday elegance, our collection brings luxury
              craftsmanship and comfort together.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dresses" className="btn-luxury btn-primary">
              Shop Women&apos;s Dresses
            </Link>
            <Link href="/shop" className="btn-luxury btn-outline">
              Browse Full Collection
            </Link>
            <Link href="/signature-dress" className="btn-luxury btn-outline">
              Explore Signature Dress
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
