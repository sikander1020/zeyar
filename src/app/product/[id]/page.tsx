'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, ChevronDown, Share2, Package, RotateCcw, Truck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import AppShell from '@/components/layout/AppShell';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import type { StoreProduct } from '@/types/storefront';

const ModelViewer3D = dynamic(() => import('@/components/storefront/ModelViewer3D'), {
  ssr: false,
});

type ProductEventPayload = {
  productId: string;
  productName: string;
  category: string;
  price: number;
  size?: string;
  color?: string;
};

function trackProductEvent(eventName: string, payload: ProductEventPayload) {
  if (typeof window === 'undefined') return;

  const event = {
    event: eventName,
    ...payload,
  };

  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push(event);
  }

  window.dispatchEvent(new CustomEvent('zaybaash:product-event', { detail: event }));
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [allProducts, setAllProducts] = useState<StoreProduct[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState({ name: '', hex: '' });
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'3d' | 'images'>('images');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Array<{
    reviewId: string;
    customerName: string;
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
  }>>([]);
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: '',
    comment: '',
    orderId: '',
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  const addItem = useCartStore(s => s.addItem);
  const toggleCart = useCartStore(s => s.toggleCart);
  const { toggle, isWishlisted } = useWishlistStore();

  useEffect(() => {
    let mounted = true;

    const pid = String(id ?? '').trim();
    setProductLoading(true);
    if (!pid) {
      setProduct(null);
      setProductLoading(false);
      return () => {
        mounted = false;
      };
    }

    fetch(`/api/products/${encodeURIComponent(pid)}`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) return { product: null } as { product: StoreProduct | null };
        return res.json() as Promise<{ product?: StoreProduct }>;
      })
      .then((single) => {
        if (!mounted) return;
        const p = single.product ?? null;
        setProduct(p);
        if (p) {
          setSelectedSize(p.sizes[0] || '');
          setSelectedColor(p.colors[0] || { name: '', hex: '' });
          setActiveImage(0);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setProduct(null);
      })
      .finally(() => {
        if (mounted) setProductLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;

    fetch('/api/products?sort=featured', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) return { products: [] } as { products: StoreProduct[] };
        return res.json() as Promise<{ products?: StoreProduct[] }>;
      })
      .then((list) => {
        if (!mounted) return;
        setAllProducts(list.products ?? []);
      })
      .catch(() => {
        if (mounted) setAllProducts([]);
      })
      .finally(() => {
        if (mounted) setCatalogLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!product?.id) return;
    let mounted = true;

    fetch(`/api/reviews?productId=${encodeURIComponent(product.id)}`, { cache: 'no-store' })
      .then((res) => res.json() as Promise<{ reviews?: Array<{
        reviewId: string;
        customerName: string;
        rating: number;
        title: string;
        comment: string;
        isVerifiedPurchase: boolean;
        createdAt: string;
      }> }>)
      .then((data) => {
        if (mounted) setReviews(data.reviews ?? []);
      })
      .catch(() => {
        if (mounted) setReviews([]);
      });

    return () => {
      mounted = false;
    };
  }, [product?.id]);

  useEffect(() => {
    if (!product?.id) return;
    const storageKey = 'zaybaash-recently-viewed-v1';
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') as string[];
      const next = [product.id, ...parsed.filter((pid) => pid !== product.id)].slice(0, 12);
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      setRecentlyViewedIds(next.filter((pid) => pid !== product.id));
    } catch {
      setRecentlyViewedIds([]);
    }
  }, [product?.id]);

  useEffect(() => {
    if (!product?.id) return;

    trackProductEvent('view_product', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      size: selectedSize || undefined,
      color: selectedColor.name || undefined,
    });
  }, [product?.id, product?.name, product?.category, product?.price, selectedSize, selectedColor.name]);

  const recentlyViewed = useMemo(() => {
    if (!product || recentlyViewedIds.length === 0) return [] as StoreProduct[];
    const byId = new Map(allProducts.map((p) => [p.id, p]));
    return recentlyViewedIds
      .map((pid) => byId.get(pid))
      .filter((p): p is StoreProduct => Boolean(p))
      .slice(0, 4);
  }, [allProducts, recentlyViewedIds, product]);

  if (productLoading) {
    return (
      <AppShell>
        <div className="pt-24 min-h-screen bg-cream flex items-center justify-center">
          <p className="text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>Loading product...</p>
        </div>
      </AppShell>
    );
  }

  if (!product) {
    return (
      <AppShell>
        <div className="pt-24 min-h-screen bg-cream flex items-center justify-center">
          <p className="text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>Product not found.</p>
        </div>
      </AppShell>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const selectedSizeSafe = selectedSize || product.sizes[0] || '';
  const selectedColorSafe = selectedColor.name ? selectedColor : (product.colors[0] || { name: '', hex: '' });

  const handleSelectColor = (color: { name: string; hex: string }) => {
    setSelectedColor(color);
    trackProductEvent('select_color', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      size: selectedSizeSafe || undefined,
      color: color.name,
    });
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    trackProductEvent('select_size', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      size,
      color: selectedColorSafe.name || undefined,
    });
  };

  const handleAddToCart = () => {
    if (!selectedSizeSafe || !selectedColorSafe.name) return;

    addItem(product, selectedSizeSafe, selectedColorSafe);
    trackProductEvent('add_to_cart', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      size: selectedSizeSafe,
      color: selectedColorSafe.name,
    });
    toggleCart();
  };

  const handleBuyNow = () => {
    if (product.outOfStock || !selectedSizeSafe || !selectedColorSafe.name) return;

    addItem(product, selectedSizeSafe, selectedColorSafe);
    trackProductEvent('buy_now_click', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      size: selectedSizeSafe,
      color: selectedColorSafe.name,
    });
    router.push('/checkout');
  };

  async function handleShare() {
    if (!product) return;
    const currentProduct = product;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: currentProduct.name,
          text: `${currentProduct.name} at ZAYBAASH`,
          url: shareUrl,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }

      trackProductEvent('share_product', {
        productId: currentProduct.id,
        productName: currentProduct.name,
        category: currentProduct.category,
        price: currentProduct.price,
        size: selectedSizeSafe || undefined,
        color: selectedColorSafe.name || undefined,
      });
    } catch {
      // Ignore cancelled share actions.
    }
  }

  async function submitReview() {
    if (!product) {
      setReviewMsg('Product is not loaded yet.');
      return;
    }
    setReviewMsg('');
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          customerName: reviewForm.customerName,
          customerEmail: reviewForm.customerEmail,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
          orderId: reviewForm.orderId,
        }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setReviewMsg(data.error ?? 'Could not submit review.');
        return;
      }
      setReviewMsg('Thanks! Your review is submitted and awaiting approval.');
      setReviewForm({ customerName: '', customerEmail: '', rating: 5, title: '', comment: '', orderId: '' });
    } catch {
      setReviewMsg('Could not submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  }

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const showRelatedLoading = catalogLoading && related.length === 0;
  const has3dSourceImages = Boolean(product.frontImageUrl || product.backImageUrl || product.images.length >= 2);
  const hasModel3d = Boolean(product.model3dUrl && product.model3dStatus === 'ready');
  const show3dTab = hasModel3d || has3dSourceImages;

  return (
    <AppShell>
      <div className="pt-24 bg-cream min-h-screen pb-24 md:pb-28">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav className="flex items-center gap-2 text-xs text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Link href="/" className="hover:text-brown transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-brown transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-brown transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-brown">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Left: Media */}
            <div>
              {show3dTab && (
                <div className="flex mb-4 border border-nude/30">
                  <button
                    type="button"
                    onClick={() => setActiveTab('images')}
                    className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase font-inter transition-all duration-300 ${activeTab === 'images' ? 'bg-brown text-cream' : 'text-brown-muted hover:text-brown'}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('3d')}
                    className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase font-inter transition-all duration-300 ${activeTab === '3d' ? 'bg-brown text-cream' : 'text-brown-muted hover:text-brown'}`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    3D View
                  </button>
                </div>
              )}

              {activeTab === '3d' && show3dTab ? (
                hasModel3d ? (
                  <ModelViewer3D modelUrl={product.model3dUrl || ''} posterUrl={product.frontImageUrl || product.images[0]} />
                ) : (
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-beige to-cream-dark mb-3 border border-nude/30 flex items-center justify-center">
                    <div className="max-w-md px-6 text-center">
                      <p className="text-xs tracking-[0.18em] uppercase text-rose-gold font-semibold font-inter mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                        3D Preview Preparing
                      </p>
                      <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                        3D model is not ready yet for this product. Use the dashboard 3D button to generate it from front and back images.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="aspect-square relative overflow-hidden bg-beige mb-3">
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square relative overflow-hidden border-2 transition-all duration-300 ${activeImage === i ? 'border-rose-gold' : 'border-transparent'}`}
                  >
                    <Image src={img} alt={`View ${i+1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product info */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs tracking-[0.2em] uppercase text-rose-gold font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {product.category}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggle(product.id)}
                    className={`p-2 border transition-all duration-300 ${wishlisted ? 'bg-rose-gold border-rose-gold text-white' : 'border-nude text-brown hover:border-rose-gold hover:text-rose-gold'}`}
                  >
                    <Heart size={16} className={wishlisted ? 'fill-current' : ''} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 border border-nude text-brown hover:border-rose-gold hover:text-rose-gold transition-all duration-300"
                  >
                    <Share2 size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <h1 className="text-4xl font-playfair text-brown mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star
                      key={i}
                      size={14}
                      className={i <= Math.round(product.rating) ? 'text-rose-gold fill-current' : 'text-nude/30'}
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-3xl font-playfair font-semibold text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Rs {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-brown-muted line-through font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Rs {product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-rose-gold font-semibold font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>

              {/* Color selector */}
              <div className="mb-6">
                <p className="text-xs tracking-[0.15em] uppercase text-brown font-semibold font-inter mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Color — <span className="normal-case font-normal text-brown-muted tracking-normal">{selectedColor.name}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleSelectColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${selectedColor.name === color.name ? 'border-rose-gold scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs tracking-[0.15em] uppercase text-brown font-semibold font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Size — <span className="normal-case font-normal text-brown-muted tracking-normal">{selectedSize}</span>
                  </p>
                  <Link href="/size-guide" className="text-xs underline text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSelectSize(size)}
                      className={`min-w-[52px] py-2.5 px-3 border text-xs font-semibold font-inter transition-all duration-300 ${selectedSize === size ? 'bg-brown text-cream border-brown' : 'border-nude text-brown hover:border-brown'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 mb-8">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={product.outOfStock}
                  onClick={handleAddToCart}
                  className="btn-luxury btn-primary flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={15} strokeWidth={2} />
                  {product.outOfStock ? 'Out of Stock' : 'Add to Bag'}
                </motion.button>
                <button
                  type="button"
                  disabled={product.outOfStock}
                  onClick={handleBuyNow}
                  className="btn-luxury btn-outline disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => toggle(product.id)}
                  className={`btn-luxury px-5 border ${wishlisted ? 'bg-rose-gold border-rose-gold text-white' : 'border-nude text-brown hover:border-rose-gold hover:text-rose-gold'} transition-all duration-300`}
                >
                  <Heart size={15} className={wishlisted ? 'fill-current' : ''} strokeWidth={1.5} />
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-nude/20 mb-8">
                {[
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: RotateCcw, text: 'Easy Returns' },
                  { icon: Package, text: 'Luxury Packaging' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-2 text-center">
                    <Icon size={18} className="text-nude" strokeWidth={1.5} />
                    <span className="text-xs text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Accordion sections */}
              {[
                { id: 'desc', title: 'Description', content: product.description },
                { id: 'details', title: 'Details & Care', content: product.details.join(' · ') },
              ].map(({ id, title, content }) => (
                <div key={id} className="border-t border-nude/20 py-4">
                  <button
                    onClick={() => setExpandedSection(expandedSection === id ? null : id)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="text-xs tracking-[0.15em] uppercase font-semibold text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-brown-muted transition-transform duration-300 ${expandedSection === id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expandedSection === id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-sm text-brown-muted font-inter leading-relaxed mt-4"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {content}
                    </motion.p>
                  )}
                </div>
              ))}

              {product.sizeChartRows.length > 0 && (
                <div className="border-t border-nude/20 py-4">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 'size-chart' ? null : 'size-chart')}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="text-xs tracking-[0.15em] uppercase font-semibold text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Size Chart
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-brown-muted transition-transform duration-300 ${expandedSection === 'size-chart' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {expandedSection === 'size-chart' && (
                    <div className="mt-4 overflow-x-auto border border-nude/20">
                      <table className="w-full text-left min-w-[540px]">
                        <thead>
                          <tr className="bg-brown text-cream text-[10px] tracking-[0.12em] uppercase">
                            <th className="px-3 py-2">Size</th>
                            <th className="px-3 py-2">Chest</th>
                            <th className="px-3 py-2">Waist</th>
                            <th className="px-3 py-2">Hips</th>
                            <th className="px-3 py-2">Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.sizeChartRows.map((row) => (
                            <tr key={row.size} className="border-t border-nude/20 bg-white">
                              <td className="px-3 py-2 text-xs text-brown font-semibold">{row.size}</td>
                              <td className="px-3 py-2 text-xs text-brown-muted">{row.chest}&quot;</td>
                              <td className="px-3 py-2 text-xs text-brown-muted">{row.waist}&quot;</td>
                              <td className="px-3 py-2 text-xs text-brown-muted">{row.hips}&quot;</td>
                              <td className="px-3 py-2 text-xs text-brown-muted">{row.length}&quot;</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-playfair text-brown mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Customer Reviews
              </h2>
              <div className="space-y-4">
                {reviews.length === 0 && (
                  <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    No approved reviews yet.
                  </p>
                )}
                {reviews.map((r) => (
                  <div key={r.reviewId} className="bg-white border border-nude/20 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{r.customerName}</p>
                      <span className="text-xs text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < r.rating ? 'text-rose-gold' : 'text-nude/30'}>★</span>
                      ))}
                      {r.isVerifiedPurchase && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 bg-green-100 text-green-700">Verified</span>
                      )}
                    </div>
                    {r.title && <p className="text-sm font-semibold text-brown mb-1 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{r.title}</p>}
                    <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-playfair text-brown mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Write a Review
              </h2>
              <div className="bg-white border border-nude/20 p-5 space-y-3">
                <input
                  value={reviewForm.customerName}
                  onChange={(e) => setReviewForm((s) => ({ ...s, customerName: e.target.value }))}
                  className="input-luxury"
                  placeholder="Your name"
                />
                <input
                  value={reviewForm.customerEmail}
                  onChange={(e) => setReviewForm((s) => ({ ...s, customerEmail: e.target.value }))}
                  className="input-luxury"
                  placeholder="Your email"
                />
                <input
                  value={reviewForm.orderId}
                  onChange={(e) => setReviewForm((s) => ({ ...s, orderId: e.target.value }))}
                  className="input-luxury"
                  placeholder="Order ID (optional, for verified badge)"
                />
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm((s) => ({ ...s, rating: Number(e.target.value) }))}
                  className="input-luxury"
                >
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>{v} stars</option>
                  ))}
                </select>
                <input
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((s) => ({ ...s, title: e.target.value }))}
                  className="input-luxury"
                  placeholder="Title (optional)"
                />
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((s) => ({ ...s, comment: e.target.value }))}
                  className="input-luxury"
                  placeholder="Your review"
                  rows={4}
                />
                <button onClick={submitReview} disabled={reviewSubmitting} className="btn-luxury btn-primary w-full">
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                {reviewMsg && (
                  <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{reviewMsg}</p>
                )}
              </div>
            </div>
          </div>

          {/* Related products */}
          {(related.length > 0 || showRelatedLoading) && (
            <div className="mt-24">
              <h2 className="text-3xl font-playfair text-brown mb-10 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                You May Also <span className="italic gradient-rose-text">Love</span>
              </h2>
              {showRelatedLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-80 rounded-2xl bg-white/70" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {related.map((p) => (
                    <Link key={p.id} href={`/product/${p.id}`} className="group product-card">
                      <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-4">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <h3 className="text-sm font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}</h3>
                      <p className="text-sm text-brown-muted font-inter mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Rs {p.price.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {recentlyViewed.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-playfair text-brown mb-10 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Recently <span className="italic gradient-rose-text">Viewed</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recentlyViewed.map((p) => (
                  <Link key={p.id} href={`/product/${p.id}`} className="group product-card">
                    <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-4">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <h3 className="text-sm font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}</h3>
                    <p className="text-sm text-brown-muted font-inter mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Rs {p.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-[90] md:hidden bg-cream/95 backdrop-blur border-t border-nude/30 p-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.12em] uppercase text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                {selectedSize ? `Size ${selectedSize}` : 'Select size'}
              </p>
              <p className="text-sm font-semibold text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Rs {product.price.toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              disabled={product.outOfStock}
              onClick={handleAddToCart}
              className="btn-luxury btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {product.outOfStock ? 'Out of Stock' : 'Add to Bag'}
            </button>
            <button
              type="button"
              disabled={product.outOfStock}
              onClick={handleBuyNow}
              className="btn-luxury btn-outline disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>
        </div>

        <div className="hidden md:block fixed bottom-0 left-0 right-0 z-[85] bg-cream/95 backdrop-blur border-t border-nude/30 p-3">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] tracking-[0.12em] uppercase text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                {selectedSizeSafe ? `Size ${selectedSizeSafe}` : 'Select size'} · {selectedColorSafe.name || 'Select color'}
              </p>
              <p className="text-base font-semibold text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Rs {product.price.toLocaleString()} · Free shipping and easy returns
              </p>
            </div>
            <button
              type="button"
              disabled={product.outOfStock}
              onClick={handleAddToCart}
              className="btn-luxury btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {product.outOfStock ? 'Out of Stock' : 'Add to Bag'}
            </button>
            <button
              type="button"
              disabled={product.outOfStock}
              onClick={handleBuyNow}
              className="btn-luxury btn-outline disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
