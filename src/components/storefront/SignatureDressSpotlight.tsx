'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { StoreProduct } from '@/types/storefront';

export default function SignatureDressSpotlight({ products }: { products: StoreProduct[] }) {
  if (!products || products.length === 0) return null;

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="signature-dress" ref={ref} className="relative mb-12 overflow-hidden border border-nude/30 bg-[#f7eee8] p-5 md:p-8 scroll-mt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 8% 18%, rgba(183,110,121,0.16) 0%, transparent 38%), radial-gradient(circle at 86% 24%, rgba(58,46,42,0.11) 0%, transparent 36%), linear-gradient(120deg, rgba(255,255,255,0.5), rgba(255,255,255,0))',
        }}
      />

      {!prefersReducedMotion && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-12 top-12 h-40 w-40 rounded-full bg-rose-gold/12 blur-2xl"
            animate={{ y: [0, -16, 0], x: [0, 8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-8 bottom-8 h-36 w-36 rounded-full bg-brown/10 blur-2xl"
            animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative mx-auto flex max-w-4xl flex-col gap-4 text-center"
      >
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45 }}
            className="text-[11px] tracking-[0.22em] uppercase text-rose-gold mb-2"
          >
            Signature Dress
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-3xl md:text-4xl font-playfair text-brown leading-tight"
          >
            The House Signature Edit
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 max-w-2xl text-sm md:text-base text-brown-muted font-inter leading-relaxed"
          >
            Each signature dress is totally handcrafted by our atelier with slow, careful finishing. These are hero pieces made in limited runs for women who want one unforgettable look.
          </motion.p>
        </div>
      </motion.div>

      <div id="signature-grid" className="relative mt-7 grid grid-cols-1 gap-4 justify-items-center sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            viewport={{ once: true, amount: 0.25 }}
            whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="group overflow-hidden border border-nude/40 bg-white w-full max-w-[360px] shadow-[0_10px_34px_rgba(58,46,42,0.08)]"
          >
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={product.images?.[0] || ''}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {!prefersReducedMotion && (
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.26)_50%,transparent_70%)]"
                    initial={{ x: '-120%' }}
                    animate={{ x: ['-120%', '130%'] }}
                    transition={{ duration: 1.8, delay: 0.4 + index * 0.2, ease: 'easeInOut' }}
                  />
                )}
                <div className="absolute left-3 top-3 bg-brown/75 px-2 py-1 text-[10px] tracking-[0.14em] uppercase text-cream">
                  Signature
                </div>
              </div>
              <div className="p-4">
                <p className="text-[10px] tracking-[0.14em] uppercase text-brown-muted">Handcrafted Piece</p>
                <h3 className="mt-1 text-lg font-playfair text-brown leading-snug">{product.name}</h3>
                <p className="mt-2 text-sm font-semibold text-brown">Rs {product.price.toLocaleString()}</p>
                <p className="mt-2 text-xs text-brown-muted leading-relaxed">
                  {product.description || 'Totally handcrafted signature dress from our atelier.'}
                </p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      <div className="relative mt-8 flex flex-col items-center gap-3 text-center">
        <p className="text-xs tracking-[0.16em] uppercase text-brown-muted">
          A signature collection for statement occasions and elevated everyday elegance.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          whileHover={prefersReducedMotion ? undefined : { y: -2 }}
        >
          <Link href="/shop#signature-grid" className="text-xs tracking-[0.12em] uppercase text-brown underline underline-offset-4 hover:text-rose-gold">
            Jump to signature grid
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
