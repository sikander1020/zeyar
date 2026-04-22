import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: 'Return & Exchange Policy — ZAYBAASH',
  description: "Read ZAYBAASH's 7-day return and exchange policy. Easy hassle-free returns on eligible items purchased from our premium women's fashion store in Pakistan.",
  alternates: {
    canonical: `${SITE_ORIGIN}/returns`,
  },
  openGraph: {
    title: 'Return & Exchange Policy | ZAYBAASH Pakistan',
    description: "7-day hassle-free returns on eligible items. Learn about ZAYBAASH's return process, conditions, and how to initiate an exchange.",
    url: `${SITE_ORIGIN}/returns`,
  },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
