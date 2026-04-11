import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: 'Cookie Policy',
  description:
    'Learn how ZAYBAASH uses cookies and similar technologies for performance, analytics, and user experience.',
};

export default function CookiePolicyPage() {
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
              Cookie <span className="italic" style={{ color: '#E6B7A9' }}>Policy</span>
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
              <h2 className="text-2xl font-playfair text-brown mb-3">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device when you browse websites. They help websites
                remember your preferences, improve performance, and provide relevant experiences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">2. How We Use Cookies</h2>
              <p>
                ZAYBAASH uses cookies and similar technologies to keep the website secure, maintain session state,
                analyze traffic, improve product discovery, and support checkout functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">3. Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Essential cookies: Required for core features such as cart state, page navigation, and security.
                </li>
                <li>
                  Performance cookies: Help us understand usage patterns and optimize speed and reliability.
                </li>
                <li>
                  Functional cookies: Remember your preferences, such as selected region or recently viewed items.
                </li>
                <li>
                  Marketing cookies: Used to measure campaign effectiveness and personalize promotional content.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">4. Third-Party Cookies</h2>
              <p>
                Some cookies may be placed by trusted third-party tools such as analytics providers, payment
                processors, and social platforms. These providers are responsible for their own cookie practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">5. Managing Cookie Preferences</h2>
              <p>
                You can manage or disable cookies through your browser settings. Disabling certain cookies may affect
                website functionality, including checkout, account actions, and personalization features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair text-brown mb-3">6. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect legal, technical, or business changes.
                The updated version will be posted on this page with the revised effective date.
              </p>
            </section>

            <section className="bg-nude/10 border-l-4 border-rose-gold p-6 rounded-r-lg">
              <h3 className="text-lg font-playfair text-brown mb-2">Need More Information?</h3>
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
