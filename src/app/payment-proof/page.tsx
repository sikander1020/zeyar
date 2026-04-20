import { Suspense } from 'react';
import PaymentProofClient from './payment-proof-client';
import type { Metadata } from 'next';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${SITE_ORIGIN}/payment-proof`,
  },
};

function Loading() {
  return (
    <div className="pt-24 min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
          Loading…
        </p>
      </div>
    </div>
  );
}

export default function PaymentProofPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentProofClient />
    </Suspense>
  );
}

