import AppShell from '@/components/layout/AppShell';
import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata = {
  title: 'Terms & Conditions',
  description:
    'Review ZAYBAASH terms and conditions for purchases, orders, pricing, shipping, returns, and website usage.',
  alternates: {
    canonical: `${SITE_ORIGIN}/terms-and-conditions`,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <AppShell>
      <div className="pt-32 pb-24 bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span
              className="text-xs tracking-[0.3em] uppercase text-rose-gold font-inter block mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Legal
            </span>
            <h1
              className="text-5xl md:text-6xl font-playfair text-brown mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Terms &amp; <span className="italic" style={{ color: '#E6B7A9' }}>Conditions</span>
            </h1>
            <p
              className="text-sm text-brown-muted font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Effective date: April 12, 2026
            </p>
          </div>

          <div className="text-brown-muted font-inter leading-relaxed bg-white/40 border border-nude/20 rounded-xl p-8 md:p-12 shadow-xl shadow-brown/5 backdrop-blur-sm space-y-8">
            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or purchasing from ZAYBAASH, you agree to these Terms &amp; Conditions. If you do not
                agree, please do not use this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">2. Product Information and Availability</h2>
              <p>
                We strive to present products, colors, and pricing accurately. Minor differences may occur due to
                screen settings and photography conditions. Product availability may change without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">3. Pricing and Payment</h2>
              <p>
                All prices are listed in PKR unless otherwise specified. We reserve the right to update prices,
                promotions, or discount terms at any time. Orders are confirmed only after successful payment or
                approved payment verification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">4. Order Acceptance and Cancellation</h2>
              <p>
                We reserve the right to decline or cancel orders due to stock issues, payment verification problems,
                pricing errors, or suspected fraudulent activity. If payment has already been made, eligible refunds
                will be processed according to our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">5. Shipping and Delivery</h2>
              <p>
                Delivery timelines are estimates and may vary due to courier delays, public holidays, weather,
                or regional constraints. Shipping charges and delivery coverage are shown at checkout where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">6. Returns and Exchanges</h2>
              <p>
                Returns and exchanges are governed by our separate Returns Policy. Items must meet eligibility
                requirements such as condition, timelines, and original tags.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">7. Intellectual Property</h2>
              <p>
                All content on this website, including logos, product images, graphics, and text, is the property
                of ZAYBAASH and may not be copied, reproduced, or distributed without prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, ZAYBAASH shall not be liable for indirect, incidental,
                or consequential losses arising from use of this website, delays, or product misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">9. Governing Law</h2>
              <p>
                These Terms are governed by the laws of Pakistan. Any disputes shall be subject to the competent
                courts of Pakistan.
              </p>
            </section>

            <section className="bg-nude/10 border-l-4 border-rose-gold p-6 rounded-r-lg">
              <h3 className="text-lg font-playfair text-brown mb-2">Questions About These Terms?</h3>
              <p className="text-sm">
                Email: care@zaybaash.com
                <br />
                Support Hours: Monday to Saturday, 10:00 AM to 6:00 PM (PKT)
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
