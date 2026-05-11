import type { Metadata } from 'next';
import AppShell from '@/components/layout/AppShell';
import HeroSection from '@/components/sections/HeroSection';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: {
    absolute: 'ZAYBAASH',
  },
  description:
    "ZAYBAASH official store for premium women's fashion in Pakistan. Shop one-piece dresses, two-piece suits, and signature handcrafted styles with nationwide delivery.",
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
    description:
      "Shop premium women's fashion by ZAYBAASH in Pakistan. Discover one-piece dresses, two-piece suits, and signature handcrafted styles.",
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
    description:
      "Premium women's fashion by ZAYBAASH in Pakistan. Shop one-piece dresses, two-piece suits, and signature handcrafted styles.",
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  return (
    <AppShell>
      <HeroSection />
    </AppShell>
  );
}
