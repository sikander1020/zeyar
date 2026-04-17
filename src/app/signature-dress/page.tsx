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
          <div className="pt-24 min-h-screen bg-cream">
            <div className="relative overflow-hidden border-b border-nude/20 bg-[linear-gradient(135deg,#f8eee8_0%,#fcf8f5_45%,#f2e7df_100%)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    'radial-gradient(circle at 20% 20%, rgba(183,110,121,0.15) 0%, transparent 35%), radial-gradient(circle at 80% 30%, rgba(58,46,42,0.08) 0%, transparent 32%), radial-gradient(circle at 50% 80%, rgba(212,149,127,0.12) 0%, transparent 36%)',
                }}
              />
              <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
                <span className="text-xs tracking-[0.34em] uppercase text-rose-gold font-semibold font-inter block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Signature Dress
                </span>
                <h1 className="text-5xl md:text-6xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Our Most <span className="italic gradient-rose-text">Loved</span> Handcrafted Piece
                </h1>
                <p className="mt-5 text-sm md:text-base text-brown-muted font-inter max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  This page is reserved for the house signature dress only. It is updated automatically from the dashboard and presents the one-of-a-kind dress in a calm, editorial, and luxurious layout.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 text-[11px] tracking-[0.18em] uppercase text-brown-muted">
                  <span className="rounded-full border border-nude/40 bg-white/70 px-3 py-1">Limited Edit</span>
                  <span className="rounded-full border border-nude/40 bg-white/70 px-3 py-1">Handcrafted</span>
                  <span className="rounded-full border border-nude/40 bg-white/70 px-3 py-1">Signature Only</span>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-14">
              <SignatureDressSpotlight products={signatureProducts} />