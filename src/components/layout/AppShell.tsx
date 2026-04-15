'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CookieConsentBanner from '@/components/layout/CookieConsentBanner';
import WhatsAppFab from '@/components/layout/WhatsAppFab';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return (
    <>
      <Navbar />
      <CartDrawer />
      <AnimatePresence mode="sync">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <CookieConsentBanner />
      <WhatsAppFab />
      <Footer />
    </>
  );
}
