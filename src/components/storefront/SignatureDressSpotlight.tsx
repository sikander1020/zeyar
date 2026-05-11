'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StoreProduct } from '@/types/storefront';

export default function SignatureDressSpotlight({ products }: { products: StoreProduct[] }) {
  const ref = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (!products || products.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0) return null;

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
        <div className="hidden md:block">
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
        </div>
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

      <div className="relative mt-7 group/carousel">
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brown shadow-lg hover:bg-brown hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-[40%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brown shadow-lg hover:bg-brown hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>

        <div 
          ref={scrollContainerRef}
          id="signature-grid" 
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 hide-scrollbar scroll-smooth px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              viewport={{ once: true, amount: 0.25 }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="group relative overflow-hidden border border-nude/40 bg-white w-[85vw] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] max-w-[360px] shrink-0 snap-center sm:snap-start shadow-[0_10px_34px_rgba(58,46,42,0.08)]"
            >
            <Link 
              href={`/product/${product.id}`} 
              className="block"
              onClick={() => {
                try {
                  window.sessionStorage.setItem(
                    `zaybaash-product-cache:${product.id}`,
                    JSON.stringify({ cachedAt: Date.now(), product })
                  );
                } catch (e) {}
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={product.images?.[0] || ''}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
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
                <p className="mt-2 text-xs text-brown-muted leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                  {product.description || 'Totally handcrafted signature dress from our atelier.'}
                </p>
              </div>
            </Link>
          </motion.article>
        ))}
        </div>
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
