import AppShell from '@/components/layout/AppShell';
import SignatureDressExperience from '@/components/storefront/SignatureDressExperience';
import { getStorefrontProducts } from '@/lib/storefrontData';
import { SITE_ORIGIN } from '@/lib/siteUrl';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signature Masterpieces — Limited Edition Handcrafted Pieces | ZAYBAASH',
  description: 'Explore the ZAYBAASH Signature line — limited-edition, bespoke masterpieces. Immersive perspectives, hand-embroidered detailing, and complete tailoring transparency.',
  alternates: {
    canonical: `${SITE_ORIGIN}/signature-dress`,
  },
  openGraph: {
    title: 'ZAYBAASH Signature Masterpieces — Handcrafted Haute Couture',
    description: 'Immerse in the ZAYBAASH Signature collection. Ultra-premium limited runs tailored with slow finishing and pure raw silk fabrics.',
    url: `${SITE_ORIGIN}/signature-dress`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZAYBAASH Signature Masterpieces — Handcrafted Luxury',
      },
    ],
  },
};

export const dynamic = 'force-dynamic';

export default async function SignatureDressPage() {
  const products = await getStorefrontProducts();
  const signatureProducts = products.filter((product) => product.isSignatureDress);

  return (
    <AppShell>
      <div className="pt-20 min-h-screen bg-cream">
        <SignatureDressExperience products={signatureProducts} />
      </div>
    </AppShell>
  );
}
