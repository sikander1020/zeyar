import AppShell from '@/components/layout/AppShell';

const faqs = [
  {
    q: 'How long does delivery take in Pakistan?',
    a: 'Most major cities receive orders within 2-4 business days. Remote areas may take 4-7 business days depending on courier coverage.',
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'Yes, COD is available in supported locations. You can choose COD at checkout where applicable.',
  },
  {
    q: 'Can I return or exchange my order?',
    a: 'Yes, eligible items can be returned or exchanged according to our Returns Policy. Items must be unused with original tags and packaging.',
  },
  {
    q: 'How do I choose the right size?',
    a: 'Use our Size Guide on product pages. If you are between sizes, contact our support team for personalized fit advice.',
  },
  {
    q: 'How can I pay via bank transfer?',
    a: 'Select Bank Transfer at checkout, place your order, then upload your payment proof from the secure payment-proof page.',
  },
  {
    q: 'How can I contact support quickly?',
    a: 'Use the WhatsApp button on the site for quick assistance, or email us at care@zaybaash.com.',
  },
];

export const metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about orders, delivery, payments, returns, and support at ZAYBAASH.',
};

export default function FaqPage() {
  return (
    <AppShell>
      <div className="pt-32 pb-24 bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-inter block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              Customer Care
            </span>
            <h1 className="text-5xl md:text-6xl font-playfair text-brown mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Frequently Asked <span className="italic" style={{ color: '#E6B7A9' }}>Questions</span>
            </h1>
            <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
              Quick answers about shopping, shipping, returns, and payments.
            </p>
          </div>

          <div className="bg-white/40 border border-nude/20 rounded-xl p-6 md:p-10 shadow-xl shadow-brown/5 backdrop-blur-sm space-y-5">
            {faqs.map((item) => (
              <section key={item.q} className="border-b border-nude/20 pb-5 last:border-b-0 last:pb-0">
                <h2 className="text-lg font-playfair text-brown mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.q}
                </h2>
                <p className="text-sm text-brown-muted font-inter leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {item.a}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
