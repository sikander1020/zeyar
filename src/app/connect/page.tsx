'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, MessageCircle, Music2, X } from 'lucide-react';

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="6" ry="6" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconFacebook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

const destinations = [
  {
    label: 'Website',
    href: 'https://www.zaybaash.com',
    icon: Globe,
    style: 'bg-brown text-cream hover:bg-brown/90',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/zaybaash/',
    icon: IconInstagram,
    style: 'bg-[#E1306C] text-white hover:bg-[#d22d65]',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@zaybaash/',
    icon: Music2,
    style: 'bg-black text-white hover:bg-black/90',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/zaybaash',
    icon: IconFacebook,
    style: 'bg-[#1877F2] text-white hover:bg-[#166fe5]',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/923219643246',
    icon: MessageCircle,
    style: 'bg-[#25D366] text-white hover:bg-[#21bf5d]',
  },
] as const;

export default function ConnectPage() {
  const [open, setOpen] = useState(true);

  const links = useMemo(() => destinations, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#f9ece6_0%,#f4dfd6_35%,#efd3c8_60%,#ead0c4_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <div className="w-full text-center">
          <p className="mb-2 text-xs tracking-[0.28em] uppercase text-brown-muted">Scan & Connect</p>
          <h1 className="text-4xl md:text-5xl font-playfair text-brown">Welcome to ZAYBAASH</h1>
          <p className="mx-auto mt-3 max-w-md text-brown-muted">Tap where you want to go.</p>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="mx-auto mt-8 w-full max-w-md rounded-3xl border border-white/60 bg-white/85 p-5 shadow-[0_24px_80px_-26px_rgba(78,43,35,0.45)] backdrop-blur"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-left text-lg font-semibold text-brown">Choose Destination</h2>
                  <button
                    type="button"
                    aria-label="Close popup"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brown/75 hover:bg-brown/10"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {links.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${item.style}`}
                      >
                        <span className="inline-flex items-center gap-2.5">
                          <Icon size={18} />
                          {item.label}
                        </span>
                        <span className="text-xs opacity-90">Open</span>
                      </a>
                    );
                  })}
                </div>

                <p className="mt-4 text-xs text-brown-muted">
                  Prefer browsing?{' '}
                  <Link href="/" className="font-semibold text-brown underline underline-offset-2">
                    Go to homepage
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-8 rounded-full bg-brown px-6 py-3 text-sm font-semibold text-cream transition hover:bg-brown/90"
            >
              Open Links Popup
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
