import AppShell from '@/components/layout/AppShell';

import { SITE_ORIGIN } from '@/lib/siteUrl';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Read how ZAYBAASH collects, uses, stores, and protects your personal information when you shop with us.',
  alternates: {
    canonical: `${SITE_ORIGIN}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
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
              Privacy <span className="italic" style={{ color: '#E6B7A9' }}>Policy</span>
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
              <h2 className="text-2xl font-playfair text-brown mb-3">1. Information We Collect</h2>
              <p>
                We collect personal information you provide during checkout, account updates, customer support,
                and newsletter subscriptions. This may include your name, email address, phone number, shipping and
                billing addresses, and order details. We also collect technical data such as device type, browser,
                IP address, and pages visited for analytics and security purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">2. How We Use Your Information</h2>
              <p>
                We use your information to process and deliver orders, provide customer support, manage returns,
                detect fraud, improve website performance, and send order updates. If you opt in, we may also send
                marketing messages about new arrivals, campaigns, and offers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">3. Sharing of Information</h2>
              <p>
                We only share your data with trusted service providers required for business operations, including
                payment gateways, shipping partners, analytics tools, and customer support systems. We do not sell
                your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">4. Payment Security</h2>
              <p>
                Payment information is processed through secure third-party providers. ZAYBAASH does not store full
                card details on its own servers. For bank transfer or payment proof submissions, we retain records
                only as needed for verification, accounting, and dispute resolution.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">5. Data Retention</h2>
              <p>
                We retain personal information only for as long as necessary to fulfill the purposes described in
                this policy, including legal, tax, fraud prevention, and recordkeeping obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">6. Your Rights</h2>
              <p>
                You may request access, correction, or deletion of your personal data, or ask us to stop marketing
                communications at any time. To make a request, contact us using the details below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">7. Policy Updates</h2>
              <p>
                We may update this Privacy Policy from time to time. Any material changes will be posted on this
                page with an updated effective date.
              </p>
            </section>

            <section className="bg-nude/10 border-l-4 border-rose-gold p-6 rounded-r-lg">
              <h3 className="text-lg font-playfair text-brown mb-2">Contact</h3>
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
