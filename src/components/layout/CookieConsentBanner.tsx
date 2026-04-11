'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type CookieChoice = 'accepted' | 'essential';

const STORAGE_KEY = 'zaybaash-cookie-consent-v1';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setVisible(true);
    }
  }, []);

  const saveChoice = (choice: CookieChoice) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[120] md:left-auto md:max-w-xl">
      <div className="bg-brown text-cream rounded-2xl border border-nude/30 shadow-2xl p-5">
        <p className="text-[11px] tracking-[0.2em] uppercase text-nude font-inter mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
          Cookie Preferences
        </p>
        <p className="text-sm text-cream/80 font-inter leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          We use cookies to improve site performance, remember your preferences, and personalize your shopping experience.
          By continuing, you agree to our cookie usage.
        </p>
        <p className="mt-3 text-xs text-cream/70 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
          Read our{' '}
          <Link href="/cookie-policy" className="underline underline-offset-2 text-nude hover:text-white">
            Cookie Policy
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline underline-offset-2 text-nude hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => saveChoice('essential')}
            className="btn-luxury btn-outline text-xs"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => saveChoice('accepted')}
            className="btn-luxury btn-primary text-xs"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
