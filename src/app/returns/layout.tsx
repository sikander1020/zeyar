import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: 'Returns',
  alternates: {
    canonical: `${SITE_ORIGIN}/returns`,
  },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
