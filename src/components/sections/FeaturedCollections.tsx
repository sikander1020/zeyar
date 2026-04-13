'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import type { StoreProduct } from '@/types/storefront';

function ProductCard({ product, index }: { product: StoreProduct; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hovered, setHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="product-card group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-beige aspect-[3/4]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}
          />
          {hovered && product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} — alternate view`}
              fill
              className="object-cover absolute inset-0 transition-opacity duration-500"
            />
          )}
          {/* Overlay */}
          <div className={`absolute inset-0 bg-brown/20 transition-opacity duration-400 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {product.isNew && <span className="badge-new">New</span>}
            {product.isSale && <span className="badge-sale">Sale</span>}
            {product.outOfStock && <span className="badge-sale">Out</span>}
          </div>

          {/* Quick actions */}
          <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-400 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <button
              onClick={(e) => { e.preventDefault(); toggle(product.id); }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${wishlisted ? 'bg-rose-gold text-white' : 'bg-white/80 text-brown hover:bg-rose-gold hover:text-white'}`}
            >
              <Heart size={14} className={wishlisted ? 'fill-current' : ''} strokeWidth={1.5} />
            </button>
            <button
              disabled={product.outOfStock}
              onClick={(e) => {
                e.preventDefault();
                addItem(product, product.sizes[1] || product.sizes[0], product.colors[0]);
              }}
              className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-brown hover:bg-brown hover:text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Add to cart bar */}
          <div className={`absolute bottom-0 left-0 right-0 bg-brown/90 text-cream text-center py-3 text-xs tracking-[0.15em] uppercase font-inter transition-all duration-400 ${hovered ? 'translate-y-0' : 'translate-y-full'}`}>
            Quick Add
          </div>
        </div>
      </Link>

      <div className="pt-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              {product.category}
            </p>
            <h3 className="text-base font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
              <Link href={`/product/${product.id}`} className="hover:text-rose-gold transition-colors duration-300">
                {product.name}
              </Link>
            </h3>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
              Rs {product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-brown-muted line-through font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Rs {product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Color swatches */}
        <div className="flex gap-1.5 mt-3">
          {product.colors.map((color) => (
            <div
              key={color.name}
              className="w-4 h-4 rounded-full border border-beige-dark cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedCollections({ initialProducts }: { initialProducts?: StoreProduct[] } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [products, setProducts] = useState<StoreProduct[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(!initialProducts);
  const [visibleCards, setVisibleCards] = useState(3);
  const [start, setStart] = useState(0);

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
  const featured = (featuredTagged.length > 0 ? featuredTagged : products).slice(0, 4);
  const maxStart = Math.max(0, featured.length - visibleCards);
  const pages = maxStart + 1;

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCards(1);
      } else if (width < 1200) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setStart((prev) => Math.min(prev, maxStart));
  }, [maxStart]);

  useEffect(() => {
    if (featured.length <= visibleCards) return;

    const timer = window.setInterval(() => {
      setStart((prev) => (prev >= maxStart ? 0 : prev + 1));
    }, 4500);

    return () => window.clearInterval(timer);
  }, [featured.length, visibleCards, maxStart]);

  const prev = () => setStart((s) => (s <= 0 ? maxStart : s - 1));
  const next = () => setStart((s) => (s >= maxStart ? 0 : s + 1));
  const cardWidthPct = 100 / Math.max(visibleCards, 1);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x <= -swipeThreshold) {
      next();
      return;
    }
    if (info.offset.x >= swipeThreshold) {
      prev();
    }
  };

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
          <div className="text-center py-10 text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            Loading featured pieces...
          </div>
        )}

        {!loading && featured.length === 0 && (
          <div className="text-center py-10 text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            Featured products will appear here once products are added.
          </div>
        )}

        {!loading && featured.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden -mx-3">
              <motion.div
                className="flex cursor-grab active:cursor-grabbing select-none"
                animate={{ x: `-${start * cardWidthPct}%` }}
                transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={handleDragEnd}
              >
                {featured.map((product, index) => (
                  <div
                    key={product.id}
                    className="px-3"
                    style={{ flex: `0 0 ${cardWidthPct}%` }}
                  >
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </motion.div>
            </div>

            {featured.length > visibleCards && (
              <div className="flex items-center justify-between gap-3 mt-6">
                <div className="flex gap-2">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setStart(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${start === i ? 'w-8 bg-brown' : 'w-2.5 bg-nude hover:bg-brown/60'}`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="w-10 h-10 border border-nude flex items-center justify-center text-brown hover:bg-nude hover:text-white transition-all duration-300"
                    aria-label="Previous featured items"
                  >
                    <ChevronLeft size={16} strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="w-10 h-10 border border-nude flex items-center justify-center text-brown hover:bg-nude hover:text-white transition-all duration-300"
                    aria-label="Next featured items"
                  >
                    <ChevronRight size={16} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
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
