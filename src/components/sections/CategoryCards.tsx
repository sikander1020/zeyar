'use client';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { StoreCategory } from '@/types/storefront';

export default function CategoryCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/categories', { cache: 'no-store' })
      .then((res) => res.json() as Promise<{ categories?: StoreCategory[] }>)
      .then((data) => {
        if (mounted) setCategories(data.categories ?? []);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="section-padding bg-beige">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Explore
          </span>
          <h2 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop by{' '}
            <span className="italic gradient-rose-text">Category</span>
          </h2>
          <div className="divider-rose" />
        </motion.div>

        {loading && (
          <div className="text-center py-10 text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            Loading categories...
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-10">
            <p className="text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
              Categories are being prepared. Browse all dresses for now.
            </p>
            <Link href="/dresses" className="btn-luxury btn-outline mt-4 inline-block">Browse Dresses</Link>
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <Link
                  href={`/dresses?category=${encodeURIComponent(cat.name)}`}
                  className="group relative block overflow-hidden aspect-[3/4] bg-nude/20"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 overlay-dark opacity-60 group-hover:opacity-75 transition-opacity duration-400" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <p className="text-xs tracking-[0.18em] uppercase text-nude/70 font-inter mb-2 group-hover:text-nude transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {cat.count} pieces
                    </p>
                    <h3 className="text-2xl font-playfair text-white mb-3 group-hover:text-nude transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {cat.name}
                    </h3>
                    <p className="text-xs text-white/60 font-inter mb-4 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-2 text-nude text-xs tracking-[0.15em] uppercase font-inter group-hover:gap-3 transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Shop Now <ArrowRight size={13} strokeWidth={2} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
