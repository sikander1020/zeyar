'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function ShopHeroMotion() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-beige py-20 text-center mb-0">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-24 h-56 w-56 rounded-full bg-rose-gold/20 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 14, 0], y: [0, 10, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-brown/10 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -16, 0], y: [0, -8, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />

      <div className="relative mx-auto max-w-3xl px-6">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-3"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          ZAYBAASH Collection
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.06 }}
          className="text-5xl font-playfair text-brown"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Shop <span className="italic gradient-rose-text">All</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 0.14 }}
          className="mt-4 text-sm text-brown-muted font-inter max-w-md mx-auto"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Discover our curated collections, new arrivals, and the stories behind each piece.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.22 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/shop#new-arrivals" className="btn-luxury btn-primary">
            New Arrivals
          </Link>
          <Link href="/dresses" className="btn-luxury btn-outline">
            Explore Dresses
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
