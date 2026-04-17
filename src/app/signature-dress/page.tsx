import AppShell from '@/components/layout/AppShell';
import SignatureDressSpotlight from '@/components/storefront/SignatureDressSpotlight';
import { getStorefrontProducts } from '@/lib/storefrontData';

export const dynamic = 'force-dynamic';

export default async function SignatureDressPage() {
  const products = await getStorefrontProducts();

  const signatureProducts = products.filter((product) => product.isSignatureDress);

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        <div className="bg-beige py-16 text-center mb-0">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Signature Dress
          </span>
          <h1 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
            Handcrafted <span className="italic gradient-rose-text">Signature</span> Pieces
          </h1>
          <p className="mt-4 text-sm text-brown-muted font-inter max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            This page is dedicated to our signature dresses only. Every piece is totally handcrafted and automatically appears here when marked as Signature Dress in the dashboard.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <SignatureDressSpotlight products={signatureProducts} />

          <div className="text-center mt-8">
            <p className="text-xs tracking-[0.16em] uppercase text-brown-muted mb-3">
              Only signature items are shown here.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}