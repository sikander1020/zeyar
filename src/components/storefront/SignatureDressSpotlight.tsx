'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { StoreProduct } from '@/types/storefront';

export default function SignatureDressSpotlight({ products }: { products: StoreProduct[] }) {
  if (!products || products.length === 0) return null;

  const featured = products.slice(0, 3);

  return (
    <section className="relative mb-12 overflow-hidden border border-nude/30 bg-[#f7eee8] p-5 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 8% 18%, rgba(183,110,121,0.16) 0%, transparent 38%), radial-gradient(circle at 86% 24%, rgba(58,46,42,0.11) 0%, transparent 36%), linear-gradient(120deg, rgba(255,255,255,0.5), rgba(255,255,255,0))',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative"
      >
        <p className="text-[11px] tracking-[0.22em] uppercase text-rose-gold mb-2">Signature Dress</p>
        <h2 className="text-3xl md:text-4xl font-playfair text-brown leading-tight">The House Signature Edit</h2>
        <p className="mt-3 max-w-2xl text-sm md:text-base text-brown-muted font-inter leading-relaxed">
          Each signature dress is totally handcrafted by our atelier with slow, careful finishing. These are hero pieces made in limited runs for women who want one unforgettable look.
        </p>
      </motion.div>

      <div className="relative mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        {featured.map((product, index) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.09, ease: [0.2, 0.8, 0.2, 1] }}
            className="group overflow-hidden border border-nude/40 bg-white"
          >
            <Link href={`/product/${product.id}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={product.images?.[0] || ''}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 bg-brown/75 px-2 py-1 text-[10px] tracking-[0.14em] uppercase text-cream">
                  Signature
                </div>
              </div>
              <div className="p-4">
                <p className="text-[10px] tracking-[0.14em] uppercase text-brown-muted">Handcrafted Piece</p>
                <h3 className="mt-1 text-lg font-playfair text-brown leading-snug">{product.name}</h3>
                <p className="mt-2 text-sm font-semibold text-brown">Rs {product.price.toLocaleString()}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
