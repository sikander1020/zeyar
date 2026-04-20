import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${SITE_ORIGIN}/track-order`,
  },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
