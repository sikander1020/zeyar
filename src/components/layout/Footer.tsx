'use client';

import Link from 'next/link';
import { Globe, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

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
  { icon: Globe, href: 'https://instagram.com', label: 'Instagram' },
  { icon: ExternalLink, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Globe, href: 'https://twitter.com', label: 'Twitter' },
  { icon: ExternalLink, href: 'https://youtube.com', label: 'YouTube' },
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
