import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: 'Size Guide',
  alternates: {
    canonical: `${SITE_ORIGIN}/size-guide`,
  },
};

export default function SizeGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
