'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StoreProduct } from '@/types/storefront';

export default function NewArrivalsSlider({ initialProducts }: { initialProducts?: StoreProduct[] } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [start, setStart] = useState(0);
  const [products, setProducts] = useState<StoreProduct[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(!initialProducts);

  useEffect(() => {
    if (initialProducts) return;
    let mounted = true;
    fetch('/api/products?sort=newest', { cache: 'no-store' })
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

  const newProducts = products.filter((p) => p.isNew);
  const sliderProducts = newProducts.length > 0 ? newProducts : products.slice(0, 6);
  const visible = 3;
  const maxStart = Math.max(0, sliderProducts.length - visible);

  const prev = () => setStart(s => Math.max(0, s - 1));
  const next = () => setStart(s => Math.min(maxStart, s + 1));

  return (
    <section className="section-padding bg-cream-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <div className="flex items-end justify-between mb-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Just Arrived
            </span>
            <h2 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
              New <span className="italic gradient-rose-text">Arrivals</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:flex gap-3"
          >
            <button
              onClick={prev}
              disabled={start === 0}
              className="w-11 h-11 border border-nude flex items-center justify-center text-brown hover:bg-nude hover:text-white transition-all duration-300 disabled:opacity-30"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              disabled={start >= maxStart}
              className="w-11 h-11 border border-nude flex items-center justify-center text-brown hover:bg-nude hover:text-white transition-all duration-300 disabled:opacity-30"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

        {loading && (
          <div className="text-center py-10 text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            Loading arrivals...
          </div>
        )}

        {!loading && sliderProducts.length === 0 && (
          <div className="text-center py-10 text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            New arrivals will appear here once products are available.
          </div>
        )}

        {!loading && sliderProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sliderProducts.slice(start, start + visible).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="product-card group"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative overflow-hidden bg-beige aspect-[3/4]">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="badge-new">{product.isNew ? "New" : "Featured"}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-brown/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                      <p className="text-xs text-cream font-inter tracking-[0.15em] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {product.category}
                      </p>
                      <h3 className="text-lg font-playfair text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-nude font-inter mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Rs {product.price.toLocaleString()}
                      </p>
                      {product.outOfStock && (
                        <p className="text-xs text-rose-gold font-inter mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Out of stock
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/dresses?sort=newest" className="btn-luxury btn-outline">
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
