'use client';

import { useMemo, useEffect, useState, Suspense, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { Heart, ShoppingBag, ChevronDown, SlidersHorizontal, X, Eye } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useToast } from '@/components/layout/ToastProvider';
import ProductQuickViewModal from '@/components/storefront/ProductQuickViewModal';
import type { StoreCategory, StoreProduct } from '@/types/storefront';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function ProductCard({ product, index, onQuickView }: { product: StoreProduct; index: number; onQuickView: (product: StoreProduct) => void }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { toast } = useToast();
  const wishlisted = isWishlisted(product.id);
  const [adding, setAdding] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smoothX = useSpring(mx, { stiffness: 220, damping: 20, mass: 0.4 });
  const smoothY = useSpring(my, { stiffness: 220, damping: 20, mass: 0.4 });
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const [hovered, setHovered] = useState(false);
  const badges = product.outOfStock
    ? [{ text: 'Out', className: 'badge-sale', style: undefined }]
    : [
        product.isSignatureDress ? { text: 'Signature', className: 'badge-new', style: { backgroundColor: '#3A2E2A' } } : null,
        product.isNew ? { text: 'New', className: 'badge-new', style: undefined } : null,
        product.isSale ? { text: 'Sale', className: 'badge-sale', style: undefined } : null,
        product.isBestseller ? { text: 'Best', className: 'badge-new', style: { backgroundColor: '#9B4F5C' } } : null,
      ].flatMap((v) => (v ? [v] : [])).slice(0, 2);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 34, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10, scale: 1.01 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4), ease: [0.2, 0.8, 0.2, 1] }}
      className="product-card group"
      ref={cardRef}
      style={{ x: smoothX, y: smoothY }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={(e) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        mx.set(px * 8);
        my.set(py * 8);
      }}
      onMouseLeave={() => {
        setHovered(false);
        mx.set(0);
        my.set(0);
      }}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-beige aspect-[3/4]">
          <motion.div className="absolute inset-0" style={{ y: imageY }}>
            <Image
              src={hovered && product.images[1] ? product.images[1] : product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />
          </motion.div>
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {badges.map((badge) => (
              <span key={badge.text} className={badge.className} style={badge.style}>{badge.text}</span>
            ))}
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const wasWishlisted = isWishlisted(product.id);
                toggle(product.id);
                toast({
                  type: 'success',
                  title: wasWishlisted ? 'Removed from wishlist' : 'Saved to wishlist',
                  message: product.name,
                });
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 ${wishlisted ? 'bg-rose-gold text-white' : 'bg-white/80 text-brown hover:bg-rose-gold hover:text-white'}`}
            >
              <Heart size={12} className={wishlisted ? 'fill-current soft-pulse' : ''} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              disabled={product.outOfStock || adding}
              onClick={(e) => {
                e.preventDefault();
                if (adding || product.outOfStock) return;
                setAdding(true);
                addItem(product, product.sizes[1] || product.sizes[0], product.colors[0]);
                toast({ type: 'success', title: 'Added to bag', message: product.name });
                window.setTimeout(() => setAdding(false), 500);
              }}
              className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-brown hover:bg-brown hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
            </button>
          </div>
          <div className={`absolute bottom-0 inset-x-0 bg-brown/90 text-cream text-center py-2.5 text-[10px] tracking-[0.15em] uppercase font-inter transition-transform duration-400 ${hovered ? 'translate-y-0' : 'translate-y-full'}`}>
            {adding ? 'Adding...' : 'Quick Add'}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className={`absolute left-1/2 top-1/2 z-20 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs tracking-[0.1em] uppercase text-brown shadow transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-100 md:opacity-0'} md:group-hover:opacity-100`}
          >
            <Eye size={13} />
            Quick View
          </button>
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
            {product.outOfStock && (
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
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [selectedColor, setSelectedColor] = useState('All Colors');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);

  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSortBy(initialSort || 'featured');
  }, [initialSort]);

  const normalizeCategory = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');

  const toDisplayCategory = (value: string) =>
    normalizeCategory(value)
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  useEffect(() => {
    if (activeCategory === 'All') return;
    const names = new Set<string>([
      ...categories
        .map((c) => toDisplayCategory(c.name))
        .filter((name) => name.toLowerCase() !== 'signature dress'),
    ]);
    if (names.size > 0 && !names.has(activeCategory)) {
      setActiveCategory('All');
    }
  }, [categories, activeCategory]);

  const categoryPills = useMemo(() => {
    const dynamic = categories.map((c) => c.name)
      .map((name) => toDisplayCategory(name))
      .filter((name) => Boolean(name) && name.toLowerCase() !== 'signature dress');

    return ['All', ...Array.from(new Set(dynamic))];
  }, [categories]);

  const bounds = useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = products.map((p) => p.price).filter((v) => Number.isFinite(v));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  }, [products]);

  const [priceMin, setPriceMin] = useState<number>(bounds.min);
  const [priceMax, setPriceMax] = useState<number>(bounds.max);

  useEffect(() => {
    setPriceMin(bounds.min);
    setPriceMax(bounds.max);
  }, [bounds.min, bounds.max]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(queryInput.trim());
    }, 180);
    return () => window.clearTimeout(timer);
  }, [queryInput]);

  const sizeOptions = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return ['All Sizes', ...Array.from(set)];
  }, [products]);

  const colorOptions = useMemo(() => {
    const names = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => names.add(c.name)));
    return ['All Colors', ...Array.from(names)];
  }, [products]);

  const activeFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string }> = [];

    if (query) filters.push({ key: 'query', label: `Search: ${query}` });
    if (activeCategory !== 'All') filters.push({ key: 'category', label: activeCategory });
    if (selectedSize !== 'All Sizes') filters.push({ key: 'size', label: `Size: ${selectedSize}` });
    if (selectedColor !== 'All Colors') filters.push({ key: 'color', label: `Color: ${selectedColor}` });
    if (onlyInStock) filters.push({ key: 'stock', label: 'In Stock' });
    if (priceMin > bounds.min || priceMax < bounds.max) {
      filters.push({ key: 'price', label: `Price: Rs ${priceMin.toLocaleString()} - Rs ${priceMax.toLocaleString()}` });
    }

    return filters;
  }, [query, activeCategory, selectedSize, selectedColor, onlyInStock, priceMin, priceMax, bounds.min, bounds.max]);

  const clearSingleFilter = (key: string) => {
    if (key === 'query') setQueryInput('');
    if (key === 'category') setActiveCategory('All');
    if (key === 'size') setSelectedSize('All Sizes');
    if (key === 'color') setSelectedColor('All Colors');
    if (key === 'stock') setOnlyInStock(false);
    if (key === 'price') {
      setPriceMin(bounds.min);
      setPriceMax(bounds.max);
    }
  };

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

    if (onlyInStock) {
      result = result.filter((p) => !p.outOfStock);
    }

    if (selectedSize !== 'All Sizes') {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    if (selectedColor !== 'All Colors') {
      result = result.filter((p) => p.colors.some((c) => c.name === selectedColor));
    }

    result = result.filter((p) => p.price >= priceMin && p.price <= priceMax);

    if (sortBy === 'newest') result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
    if (sortBy === 'popular') result.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, activeCategory, sortBy, query, onlyInStock, selectedSize, selectedColor, priceMin, priceMax]);

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        <div className="bg-beige py-16 text-center mb-0">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            ZAYBAASH Collection
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our <span className="italic gradient-rose-text">Dresses</span>
          </h1>
          <p className="mt-4 text-sm text-brown-muted font-inter max-w-md mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Explore every piece — from elegant one-pieces to curated sets — crafted for the modern woman.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="sticky top-20 z-30 mb-5 bg-cream/95 backdrop-blur border border-nude/20 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max gap-2">
                  {categoryPills.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`shrink-0 whitespace-nowrap px-4 py-2 text-xs tracking-[0.12em] uppercase font-inter border transition-all duration-300 ${activeCategory === cat ? 'bg-brown text-cream border-brown' : 'bg-transparent text-brown border-nude hover:border-brown'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3 lg:w-auto lg:justify-end">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters((v) => !v)}
                  className="inline-flex h-[42px] items-center justify-center gap-2 px-3 border border-nude text-xs tracking-[0.12em] uppercase text-brown hover:border-brown transition-colors"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                </button>
                <div className="relative min-w-[170px] flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full h-[42px] pl-4 pr-10 bg-transparent border border-nude text-sm text-brown font-inter outline-none cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {sortOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-muted pointer-events-none" />
                </div>
                <span className="ml-auto text-xs sm:text-sm text-brown-muted font-inter whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {filtered.length} pieces
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4 items-stretch">
            <input
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search dresses"
              className="input-luxury h-[56px]"
            />

            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="appearance-none w-full h-[56px] pl-4 pr-10 py-3 bg-transparent border border-nude text-sm text-brown font-inter outline-none cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {sizeOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-muted pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 justify-start lg:justify-end h-[56px]">
              <button
                type="button"
                onClick={() => setOnlyInStock((v) => !v)}
                className={`h-[48px] px-3 sm:px-4 text-[11px] sm:text-xs tracking-[0.12em] uppercase font-inter border transition-all duration-300 ${onlyInStock ? 'bg-brown text-cream border-brown' : 'border-nude text-brown hover:border-brown'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                In Stock Only
              </button>
              <button
                type="button"
                onClick={() => {
                  setQueryInput('');
                  setOnlyInStock(false);
                  setSelectedSize('All Sizes');
                  setSelectedColor('All Colors');
                  setActiveCategory('All');
                  setPriceMin(bounds.min);
                  setPriceMax(bounds.max);
                  setSortBy('featured');
                }}
                className="h-[48px] px-2 text-[11px] sm:text-xs text-brown-muted underline underline-offset-2 hover:text-brown transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border border-nude/20 p-4 mb-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 items-end">
                  <div className="relative">
                    <label className="block text-[10px] tracking-[0.12em] uppercase text-brown-muted mb-2">Color</label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="appearance-none w-full h-[48px] pl-4 pr-10 py-3 bg-transparent border border-nude text-sm text-brown font-inter outline-none cursor-pointer"
                    >
                      {colorOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-[36px] -translate-y-1/2 text-brown-muted pointer-events-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.12em] uppercase text-brown-muted mb-2">Min Price</label>
                    <input
                      type="number"
                      min={bounds.min}
                      max={priceMax}
                      value={priceMin}
                      onChange={(e) => {
                        const next = Number(e.target.value) || bounds.min;
                        setPriceMin(Math.min(next, priceMax));
                      }}
                      className="input-luxury h-[48px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.12em] uppercase text-brown-muted mb-2">Max Price</label>
                    <input
                      type="number"
                      min={priceMin}
                      max={bounds.max}
                      value={priceMax}
                      onChange={(e) => {
                        const next = Number(e.target.value) || bounds.max;
                        setPriceMax(Math.max(next, priceMin));
                      }}
                      className="input-luxury h-[48px]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(false)}
                    className="h-[48px] px-4 text-xs tracking-[0.12em] uppercase font-inter border border-nude text-brown hover:border-brown"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => clearSingleFilter(filter.key)}
                  className="inline-flex items-center gap-1 rounded-full border border-nude bg-white px-3 py-1.5 text-xs text-brown hover:border-brown transition-colors"
                >
                  {filter.label}
                  <X size={12} />
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickViewProduct} />
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

          <ProductQuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
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
