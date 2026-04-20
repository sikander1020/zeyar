import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${SITE_ORIGIN}/checkout`,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
