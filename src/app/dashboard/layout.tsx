import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: 'Admin Dashboard — ZAYBAASH',
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${SITE_ORIGIN}/dashboard`,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', margin: 0, background: '#FAF7F4' }}>
      {children}
    </div>
  );
}
