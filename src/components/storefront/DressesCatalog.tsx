'use client';

import { useMemo, useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import type { StoreCategory, StoreProduct } from '@/types/storefront';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function ProductCard({ product, index }: { product: StoreProduct; index: number }) {
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
            {(product.outOfStock || product.stock <= 0) && <span className="badge-sale">Out</span>}
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={(e) => { e.preventDefault(); toggle(product.id); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${wishlisted ? 'bg-rose-gold text-white' : 'bg-white/80 text-brown hover:bg-rose-gold hover:text-white'}`}
            >
              <Heart size={12} className={wishlisted ? 'fill-current' : ''} strokeWidth={1.5} />
            </button>
            <button
              disabled={product.outOfStock || product.stock <= 0}
              onClick={(e) => { e.preventDefault(); addItem(product, product.sizes[1] || product.sizes[0], product.colors[0]); }}
              className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-brown hover:bg-brown hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-60 disabled:cursor-not-allowed"
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
            <span className="text-sm font-semibold text-brown font-inter">Rs {product.price.toLocaleString()}</span>
            {(product.outOfStock || product.stock <= 0) && (
              <span className="text-xs text-rose-gold font-inter ml-2">Out of stock</span>
            )}
            {product.originalPrice && (
              <span className="text-xs text-brown-muted line-through font-inter ml-1">Rs {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DressesCatalogContent({ initialProducts, initialCategories }: { initialProducts: StoreProduct[]; initialCategories: StoreCategory[] }) {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') ?? 'All').trim() || 'All';
  const initialSort = (searchParams.get('sort') ?? 'featured').trim();

  const [products] = useState<StoreProduct[]>(initialProducts);
  const [categories] = useState<StoreCategory[]>(initialCategories);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort || 'featured');
  const [query, setQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [maxPrice, setMaxPrice] = useState(600000);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSortBy(initialSort || 'featured');
  }, [initialSort]);

  useEffect(() => {
    if (activeCategory === 'All') return;
    const fixed = ['All', 'Dresses', 'Formal', 'Casual', 'One Piece'];
    const names = new Set<string>([
      ...fixed,
      ...categories.map((c) => c.name),
      ...products.map((p) => p.category),
    ]);
    if (names.size > 0 && !names.has(activeCategory)) {
      setActiveCategory('All');
    }
  }, [categories, products, activeCategory]);

  const categoryPills = useMemo(() => {
    const fixed = ['All', 'Dresses', 'Formal', 'Casual', 'One Piece'];
    const dynamic = new Set<string>([...categories.map((c) => c.name), ...products.map((p) => p.category)]);
    return [...new Set([...fixed, ...Array.from(dynamic).filter(Boolean)])];
  }, [categories, products]);

  const sizeOptions = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return ['All Sizes', ...Array.from(set)];
  }, [products]);

  const normalizeCategory = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'All') {
      const target = normalizeCategory(activeCategory);
      const exact = result.filter((p) => normalizeCategory(p.category) === target);
      if (exact.length > 0) {
        result = exact;
      } else if (target === 'one piece' || target === 'onepiece') {
        result = result.filter((p) => {
          const c = normalizeCategory(p.category);
          return c === 'dress' || c === 'dresses' || c.includes('one piece') || c.includes('onepiece');
        });
      } else {
        result = exact;
      }
    }
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(normalizedQuery) ||
        p.category.toLowerCase().includes(normalizedQuery) ||
        p.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
      );
    }

    result = result.filter((p) => p.price <= maxPrice);

    if (onlyInStock) {
      result = result.filter((p) => !p.outOfStock && p.stock > 0);
    }

    if (selectedSize !== 'All Sizes') {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    if (sortBy === 'newest') result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
    if (sortBy === 'popular') result.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, activeCategory, sortBy, query, maxPrice, onlyInStock, selectedSize]);

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        <div className="bg-beige py-16 text-center mb-0">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            ZAYBAASH Collection
          </span>
          <h1 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our <span className="italic gradient-rose-text">Dresses</span>
          </h1>
          <p className="mt-4 text-sm text-brown-muted font-inter max-w-md mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Explore every piece — from elegant one-pieces to curated sets — crafted for the modern woman.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {categoryPills.map((cat) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dresses"
              className="input-luxury"
            />

            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="appearance-none w-full pl-4 pr-10 py-3 bg-transparent border border-nude text-sm text-brown font-inter outline-none cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {sizeOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-muted pointer-events-none" />
            </div>

            <div className="border border-nude px-3 py-2.5">
              <label className="text-[10px] tracking-[0.12em] uppercase text-brown-muted font-inter block mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Max Price
              </label>
              <input
                type="range"
                min={10000}
                max={600000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-brown font-inter mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Rs {maxPrice.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOnlyInStock((v) => !v)}
                className={`px-4 py-2.5 text-xs tracking-[0.12em] uppercase font-inter border transition-all duration-300 ${onlyInStock ? 'bg-brown text-cream border-brown' : 'border-nude text-brown hover:border-brown'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                In Stock Only
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setOnlyInStock(false);
                  setSelectedSize('All Sizes');
                  setMaxPrice(600000);
                  setActiveCategory('All');
                  setSortBy('featured');
                }}
                className="text-xs text-brown-muted underline underline-offset-2 hover:text-brown transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              <button onClick={() => setActiveCategory('All')} className="btn-luxury btn-outline">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function DressesCatalog(props: { initialProducts: StoreProduct[]; initialCategories: StoreCategory[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><p className="text-brown font-inter tracking-[0.2em] uppercase text-xs">Loading...</p></div>}>
      <DressesCatalogContent {...props} />
    </Suspense>
  );
}
