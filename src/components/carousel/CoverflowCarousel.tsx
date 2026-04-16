'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToast } from '@/components/layout/ToastProvider';
import ProductQuickViewModal from '@/components/storefront/ProductQuickViewModal';
import type { StoreProduct } from '@/types/storefront';

interface CoverflowCarouselProps {
  products: StoreProduct[];
  onSlideChange?: (index: number) => void;
}

const CARD_ANGLE = 35; // Rotation angle for side cards

function getCoverflowMetrics(viewportWidth: number) {
  if (viewportWidth < 640) {
    return {
      cardWidth: 220,
      containerHeight: 430,
      perspective: 900,
      sideOffset: 130,
      sideDepth: -85,
      sideScale: 0.84,
      centerScale: 1.03,
      farOffset: 180,
      farDepth: -170,
    };
  }

  if (viewportWidth < 1024) {
    return {
      cardWidth: 290,
      containerHeight: 520,
      perspective: 1200,
      sideOffset: 180,
      sideDepth: -110,
      sideScale: 0.86,
      centerScale: 1.08,
      farOffset: 250,
      farDepth: -210,
    };
  }

  return {
    cardWidth: 360,
    containerHeight: 620,
    perspective: 1500,
    sideOffset: 230,
    sideDepth: -140,
    sideScale: 0.87,
    centerScale: 1.12,
    farOffset: 330,
    farDepth: -260,
  };
}

export default function CoverflowCarousel({ products, onSlideChange }: CoverflowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [centerTilt, setCenterTilt] = useState({ x: 0, y: 0 });
  const [addingId, setAddingId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { toast } = useToast();

  const total = products.length;

  useEffect(() => {
    if (total === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= total || Number.isNaN(activeIndex)) {
      setActiveIndex(0);
    }
  }, [activeIndex, total]);

  // Autoplay functionality
  useEffect(() => {
    if (reduceMotion || !isAutoplay || total < 2) return;

    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % total;
        onSlideChange?.(next);
        return next;
      });
    }, 3200);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isAutoplay, total, reduceMotion, onSlideChange]);

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const handlePrev = () => {
    if (total < 2) return;
    setActiveIndex((prev) => {
      const next = (prev - 1 + total) % total;
      onSlideChange?.(next);
      return next;
    });
  };

  const handleNext = () => {
    if (total < 2) return;
    setActiveIndex((prev) => {
      const next = (prev + 1) % total;
      onSlideChange?.(next);
      return next;
    });
  };

  const handlePointerMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || viewportWidth < 1024) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    const tiltY = (px - 0.5) * 7;
    const tiltX = (0.5 - py) * 5;
    setCenterTilt({ x: tiltX, y: tiltY });
  };

  const resetPointerTilt = () => {
    setCenterTilt({ x: 0, y: 0 });
  };

  const getRelativePosition = (index: number): number => {
    if (total === 0) return 0;
    let position = index - activeIndex;

    if (position > total / 2) {
      position -= total;
    } else if (position < -total / 2) {
      position += total;
    }

    return position;
  };

  const getCardPosition = (position: number): { x: number; z: number; angle: number; opacity: number; scale: number } => {
    const metrics = getCoverflowMetrics(viewportWidth);

    if (position === 0) {
      // Center card - focused
      return { x: 0, z: 0, angle: 0, opacity: 1, scale: metrics.centerScale };
    } else if (position === 1) {
      // Right card - rotated right
      return { x: metrics.sideOffset, z: metrics.sideDepth, angle: CARD_ANGLE, opacity: 0.72, scale: metrics.sideScale };
    } else if (position === -1) {
      // Left card - rotated left
      return { x: -metrics.sideOffset, z: metrics.sideDepth, angle: -CARD_ANGLE, opacity: 0.72, scale: metrics.sideScale };
    } else if (Math.abs(position) === 2) {
      // Far cards - barely visible
      return {
        x: position > 0 ? metrics.farOffset : -metrics.farOffset,
        z: metrics.farDepth,
        angle: position > 0 ? CARD_ANGLE * 1.5 : -CARD_ANGLE * 1.5,
        opacity: 0.2,
        scale: 0.7,
      };
    }

    return {
      x: position * metrics.farOffset,
      z: metrics.farDepth - 80,
      angle: position > 0 ? CARD_ANGLE * 2 : -CARD_ANGLE * 2,
      opacity: 0,
      scale: 0.55,
    };
  };

  const metrics = getCoverflowMetrics(viewportWidth);

  if (total === 0) {
    return null;
  }

  return (
    <div className="relative w-full py-8 md:py-12">
      {/* Perspective container */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          perspective: `${metrics.perspective}px`,
          height: `${metrics.containerHeight}px`,
        }}
        onMouseMove={handlePointerMove}
        onMouseOut={resetPointerTilt}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto h-20 w-[72%] rounded-full bg-brown/15 blur-2xl" />

        {/* Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          {products.map((product, index) => {
            const position = getRelativePosition(index);
            if (Math.abs(position) > 2) return null;

            const { x, z, angle, opacity, scale } = getCardPosition(position);
            const isCenter = index === activeIndex;

            return (
              <motion.div
                key={product.id}
                className="absolute"
                animate={{
                  x,
                  z,
                  rotateY: reduceMotion ? 0 : isCenter ? centerTilt.y : angle,
                  rotateX: reduceMotion ? 0 : isCenter ? centerTilt.x : 0,
                  opacity,
                  scale,
                }}
                transition={{
                  type: reduceMotion ? 'tween' : 'spring',
                  duration: reduceMotion ? 0.22 : undefined,
                  stiffness: isCenter ? 120 : 220,
                  damping: isCenter ? 24 : 28,
                  mass: isCenter ? 1 : 0.9,
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  width: `${metrics.cardWidth}px`,
                  zIndex: isCenter ? 40 : 30 - Math.abs(position),
                  pointerEvents: isCenter ? 'auto' : 'none',
                }}
              >
                {/* Card container with shadow */}
                <div
                  className={`relative rounded-lg overflow-hidden transition-shadow duration-500 ${
                    isCenter ? 'shadow-2xl' : 'shadow-lg'
                  }`}
                  style={{
                    boxShadow: isCenter
                      ? '0 42px 80px -24px rgba(20, 10, 5, 0.55), 0 18px 32px -18px rgba(20, 10, 5, 0.45), 0 0 60px rgba(20, 10, 5, 0.2)'
                      : '0 20px 38px -16px rgba(20, 10, 5, 0.35)',
                  }}
                >
                  {/* Product Image */}
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-[3/4] bg-beige overflow-hidden group cursor-pointer">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={isCenter}
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-brown/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                      {/* Badges */}
                      {isCenter && (
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.isNew && <span className="badge-new">New</span>}
                          {product.isSale && <span className="badge-sale">Sale</span>}
                          {product.outOfStock && <span className="badge-sale">Out</span>}
                        </div>
                      )}

                      {/* Quick Actions - Only visible when center */}
                      {isCenter && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brown/95 to-brown/60 p-4 md:p-6 text-cream"
                        >
                          <div className="flex gap-3 mb-4">
                            <button
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
                              className={`flex-1 h-10 rounded flex items-center justify-center gap-2 transition-all duration-300 text-sm font-semibold ${
                                isWishlisted(product.id)
                                  ? 'bg-rose-gold text-cream'
                                  : 'bg-cream/20 text-cream hover:bg-rose-gold'
                              }`}
                            >
                              <Heart size={16} className={isWishlisted(product.id) ? 'fill-current' : ''} />
                              {isWishlisted(product.id) ? 'Saved' : 'Save'}
                            </button>
                            <button
                              disabled={product.outOfStock || addingId === product.id}
                              onClick={(e) => {
                                e.preventDefault();
                                if (product.outOfStock || addingId === product.id) return;
                                setAddingId(product.id);
                                addItem(product, product.sizes[1] || product.sizes[0], product.colors[0]);
                                toast({ type: 'success', title: 'Added to bag', message: product.name });
                                window.setTimeout(() => {
                                  setAddingId((current) => (current === product.id ? null : current));
                                }, 500);
                              }}
                              className="flex-1 h-10 rounded bg-cream text-brown flex items-center justify-center gap-2 font-semibold hover:bg-rose-gold hover:text-cream transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ShoppingBag size={16} />
                              {addingId === product.id ? 'Adding...' : 'Add'}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="mb-3 w-full rounded border border-cream/35 bg-cream/10 py-2 text-[11px] tracking-[0.14em] uppercase hover:bg-cream/20 transition-colors"
                          >
                            Quick View
                          </button>

                          <div className="text-center">
                            <p className="text-xs tracking-widest uppercase font-inter mb-1">{product.category}</p>
                            <h3 className="text-lg font-playfair font-semibold mb-2">{product.name}</h3>
                            <p className="text-base font-semibold">Rs {product.price.toLocaleString()}</p>
                            {product.originalPrice && (
                              <p className="text-xs text-rose-gold line-through">Rs {product.originalPrice.toLocaleString()}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brown hover:bg-brown hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          aria-label="Previous"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brown hover:bg-brown hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          aria-label="Next"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-3 mt-8">
        {products.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              onSlideChange?.(index);
            }}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-brown w-8 h-3' : 'bg-nude hover:bg-brown/60 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="text-center mt-6 text-brown-muted font-inter text-sm">
        <span className="font-semibold text-brown">{activeIndex + 1}</span>
        <span> / {total}</span>
      </div>

      <ProductQuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
