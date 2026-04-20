'use client';

import Link from 'next/link';
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

  const nonSignature = products.filter((p) => !p.isSignatureDress);
  const featuredTagged = nonSignature.filter((p) => p.isBestseller || p.isNew);
  const featured = (featuredTagged.length > 0 ? featuredTagged : nonSignature).slice(0, 8);
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.span variants={itemVariants} className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Curated For You
          </motion.span>
          <motion.h2 variants={itemVariants} className="text-5xl font-playfair text-brown mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Featured{' '}
            <span className="italic gradient-rose-text">Pieces</span>
          </motion.h2>
          <motion.div variants={itemVariants} className="divider-rose" />
          <motion.p variants={itemVariants} className="text-brown-muted font-inter max-w-md mx-auto mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Handpicked from our latest collection — pieces that define the ZAYBAASH woman.
          </motion.p>
        </motion.div>

        {loading && (
          <div className="py-10">
            <div className="mx-auto mb-6 h-[420px] max-w-[420px] skeleton rounded-xl" />
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-2.5 w-2.5 rounded-full skeleton" />
              ))}
            </div>
          </div>
        )}

        {!loading && featured.length === 0 && (
          <div className="text-center py-20 text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            Featured products will appear here once products are added.
          </div>
        )}

        {!loading && featured.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <CoverflowCarousel products={featured} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link href="/dresses" className="btn-luxury btn-outline">
            View All Pieces
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
