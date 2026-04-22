import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: 'About ZAYBAASH — Our Story, Mission & Values',
  description: 'Learn about ZAYBAASH — a luxury women\'s fashion brand founded in Islamabad, Pakistan. Discover our story, our commitment to quality, and the values that define every piece we create.',
  alternates: {
    canonical: `${SITE_ORIGIN}/about`,
  },
  openGraph: {
    title: 'About ZAYBAASH — Our Story, Mission & Values',
    description: 'Discover the ZAYBAASH story. A luxury women\'s fashion brand born in Islamabad, Pakistan — crafting premium pieces that make every woman feel extraordinary.',
    url: `${SITE_ORIGIN}/about`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZAYBAASH Brand Story',
      },
    ],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
