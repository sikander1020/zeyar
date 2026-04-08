'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

function IconInstagram({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconTikTok({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );
}

function IconFacebook({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Dresses', href: '/shop?category=Dresses' },
    { label: 'Two-Piece Sets', href: '/shop?category=Two-Piece' },
    { label: 'Casual', href: '/shop?category=Casual' },
    { label: 'Formal', href: '/shop?category=Formal' },
  ],
  Company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Sustainability', href: '/about#sustainability' },
    { label: 'Careers', href: '/contact' },
    { label: 'Press', href: '/contact' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Returns', href: '/returns' },
  ],
};

const socials = [
  { icon: IconInstagram, href: 'https://instagram.com/zaybaash', label: 'Instagram' },
  { icon: IconTikTok, href: 'https://tiktok.com/@zaybaash', label: 'TikTok' },
  { icon: IconFacebook, href: 'https://facebook.com/zaybaash', label: 'Facebook' },
  
];

export default function Footer() {
  return (
    <footer className="bg-brown text-cream/80 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <span
              className="text-4xl font-playfair font-bold tracking-[0.2em] text-nude block mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ZAYBAASH
            </span>
            <p className="text-sm leading-relaxed text-cream/60 mb-8 max-w-xs font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
              Born from a love of femininity and grace, ZAYBAASH crafts beauty with style for the modern woman — where elegance meets authenticity.
            </p>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-9 h-9 rounded-full border border-nude/30 flex items-center justify-center text-nude/70 hover:text-nude hover:border-nude transition-colors duration-300"
                >
                  <Icon size={15} strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                className="text-xs tracking-[0.25em] uppercase text-nude font-semibold mb-6 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/50 hover:text-cream transition-colors duration-300 font-inter"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Strip */}
        <div className="border-t border-cream/10 pt-10 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4
                className="text-xl font-playfair text-nude mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Join the ZAYBAASH Circle
              </h4>
              <p className="text-sm text-cream/50 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Get exclusive access to new arrivals and private sales.
              </p>
            </div>
            <div className="flex gap-0 w-full max-w-sm">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-cream/10 border border-nude/20 text-cream text-sm outline-none focus:border-nude/60 transition-colors placeholder:text-cream/30 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <button className="px-6 py-3 bg-nude text-brown text-xs tracking-[0.15em] uppercase font-semibold font-inter hover:bg-nude-light transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/30 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2026 ZAYBAASH. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link
                key={item}
                href="/"
                className="text-xs text-cream/30 hover:text-cream/60 transition-colors duration-300 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
