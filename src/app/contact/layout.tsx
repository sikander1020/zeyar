import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE_ORIGIN}/contact`,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
