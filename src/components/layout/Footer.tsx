'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

function IconInstagram({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="6" ry="6"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function IconTikTok({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 7.337a5.5 5.5 0 0 1-3.29-1.075A5.5 5.5 0 0 1 15.5 2H12v13.5a2.5 2.5 0 1 1-3.5-2.291V9.638A6.5 6.5 0 0 0 5.5 16a6.5 6.5 0 0 0 6.5 6.5A6.5 6.5 0 0 0 18.5 16V9.101A9.46 9.46 0 0 0 21 9.5V7.337z"/>
    </svg>
  );
}

function IconFacebook({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
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
                  <Icon size={15} />
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
