'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import CoverflowCarousel from '@/components/carousel/CoverflowCarousel';
import type { StoreProduct } from '@/types/storefront';

export default function FeaturedCollections({ initialProducts }: { initialProducts?: StoreProduct[] } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [products, setProducts] = useState<StoreProduct[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(!initialProducts);

  useEffect(() => {
    if (initialProducts) return;
    let mounted = true;
    fetch('/api/products?sort=featured', { cache: 'no-store' })
      .then((res) => res.json() as Promise<{ products?: StoreProduct[] }>)
      .then((data) => {
        if (mounted) setProducts(data.products ?? []);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [initialProducts]);

  const featuredTagged = products.filter((p) => p.isBestseller || p.isNew);
  const featured = (featuredTagged.length > 0 ? featuredTagged : products).slice(0, 8);

  return (
    <section className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Curated For You
          </span>
          <h2 className="text-5xl font-playfair text-brown mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Featured{' '}
            <span className="italic gradient-rose-text">Pieces</span>
          </h2>
          <div className="divider-rose" />
          <p className="text-brown-muted font-inter max-w-md mx-auto mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Handpicked from our latest collection — pieces that define the ZAYBAASH woman.
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-20 text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            Loading featured pieces...
          </div>
        )}

        {!loading && featured.length === 0 && (
          <div className="text-center py-20 text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            Featured products will appear here once products are added.
          </div>
        )}

        {!loading && featured.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <CoverflowCarousel products={featured} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-14"
        >
          <a href="/dresses" className="btn-luxury btn-outline">
            View All Pieces
          </a>
        </motion.div>
      </div>
    </section>
  );
}
