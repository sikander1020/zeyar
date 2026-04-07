'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products, categories } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import NewArrivalsSlider from '@/components/sections/NewArrivalsSlider';
import CategoryCards from '@/components/sections/CategoryCards';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4) }}
      className="product-card group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-beige aspect-[3/4]">
          <Image
            src={hovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && <span className="badge-new">New</span>}
            {product.isSale && <span className="badge-sale">Sale</span>}
            {product.isBestseller && <span className="badge-new" style={{ backgroundColor: '#9B4F5C' }}>Best</span>}
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={(e) => { e.preventDefault(); toggle(product.id); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${wishlisted ? 'bg-rose-gold text-white' : 'bg-white/80 text-brown hover:bg-rose-gold hover:text-white'}`}
            >
              <Heart size={12} className={wishlisted ? 'fill-current' : ''} strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); addItem(product, product.sizes[1] || product.sizes[0], product.colors[0]); }}
              className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-brown hover:bg-brown hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
            </button>
          </div>
          <div className={`absolute bottom-0 inset-x-0 bg-brown/90 text-cream text-center py-2.5 text-[10px] tracking-[0.15em] uppercase font-inter transition-transform duration-400 ${hovered ? 'translate-y-0' : 'translate-y-full'}`}>
            Quick Add
          </div>
        </div>
      </Link>
      <div className="pt-4">
        <p className="text-[10px] tracking-[0.15em] uppercase text-brown-muted font-inter mb-1">{product.category}</p>
        <h3 className="text-sm font-playfair text-brown leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map(c => (
              <div key={c.name} className="w-3.5 h-3.5 rounded-full border-[1.5px] border-beige-dark" style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-brown font-inter">Rs {(product.price * 280).toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-brown-muted line-through font-inter ml-1">Rs {(product.originalPrice * 280).toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = searchParams.get('sort') === 'newest' ? 'newest' : 'featured';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category');
    setActiveCategory(category || 'All');
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === 'newest') result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, sortBy, priceRange]);

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        {/* Page Header */}
        <div className="bg-beige py-16 text-center mb-0">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            ZEYAR Collection
          </span>
          <h1 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop <span className="italic gradient-rose-text">All</span>
          </h1>
        </div>

        {activeCategory === 'All' && (
          <>
            <FeaturedCollections />
            <NewArrivalsSlider />
          </>
        )}

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              {['All', ...categories.map(c => c.name)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 text-xs tracking-[0.12em] uppercase font-inter border transition-all duration-300 ${activeCategory === cat ? 'bg-brown text-cream border-brown' : 'bg-transparent text-brown border-nude hover:border-brown'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-transparent border border-nude text-sm text-brown font-inter outline-none cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-muted pointer-events-none" />
              </div>
              <span className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                {filtered.length} pieces
              </span>
            </div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-2xl font-playfair text-brown mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                No pieces found
              </p>
              <button onClick={() => { setActiveCategory('All'); setPriceRange([0, 600]); }} className="btn-luxury btn-outline">
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {activeCategory === 'All' && (
          <>
            <CategoryCards />
            <Testimonials />
            <Newsletter />
          </>
        )}
      </div>
    </AppShell>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><p className="text-brown font-inter tracking-[0.2em] uppercase text-xs">Loading...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}
