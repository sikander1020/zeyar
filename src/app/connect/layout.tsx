import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: 'Connect with ZAYBAASH',
  alternates: {
    canonical: `${SITE_ORIGIN}/connect`,
  },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
