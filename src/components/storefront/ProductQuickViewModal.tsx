'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToast } from '@/components/layout/ToastProvider';
import type { StoreProduct } from '@/types/storefront';

type ProductQuickViewModalProps = {
  product: StoreProduct | null;
  onClose: () => void;
};

export default function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>({ name: '', hex: '' });
  const [adding, setAdding] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { toggle, isWishlisted } = useWishlistStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!product) return;

    setActiveImage(0);
    setSelectedSize(product.sizes[0] || '');
    setSelectedColor(product.colors[0] || { name: '', hex: '' });
    setAdding(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    window.setTimeout(() => closeRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    if (!selectedSize || !selectedColor.name || adding || product.outOfStock) return;

    setAdding(true);
    addItem(product, selectedSize, selectedColor);
    toast({ type: 'success', title: 'Added to bag', message: product.name });
    toggleCart();
    window.setTimeout(() => setAdding(false), 500);
  };

  const handleWishlist = () => {
    const wasWishlisted = isWishlisted(product.id);
    toggle(product.id);
    toast({
      type: 'success',
      title: wasWishlisted ? 'Removed from wishlist' : 'Saved to wishlist',
      message: product.name,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] bg-brown/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view for ${product.name}`}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.22 }}
        className="fixed left-1/2 top-1/2 z-[130] w-[min(96vw,980px)] -translate-x-1/2 -translate-y-1/2 border border-nude/30 bg-cream shadow-[0_38px_120px_-40px_rgba(58,46,42,0.6)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full border border-nude/40 bg-white/90 p-2 text-brown hover:text-rose-gold"
          aria-label="Close quick view"
        >
          <X size={16} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">
          <div className="border-b border-nude/20 md:border-b-0 md:border-r md:border-nude/20 p-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-beige">
              <Image
                src={product.images[activeImage] || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.images.slice(0, 5).map((img, i) => (
                  <button
                    key={`${product.id}-img-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-square overflow-hidden border ${activeImage === i ? 'border-rose-gold' : 'border-nude/30'}`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 md:p-7">
            <p className="text-[10px] tracking-[0.18em] uppercase text-rose-gold mb-2">{product.category}</p>
            <h3 className="text-2xl font-playfair text-brown leading-tight">{product.name}</h3>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-brown">Rs {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-brown-muted line-through">Rs {product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <p className="mt-4 text-sm text-brown-muted leading-relaxed">
              {product.description || 'A refined ZAYBAASH piece designed for statement elegance.'}
            </p>

            <div className="mt-5">
              <p className="text-[10px] tracking-[0.15em] uppercase text-brown-muted mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={`${product.id}-size-${size}`}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] border px-3 py-2 text-xs ${selectedSize === size ? 'border-brown bg-brown text-cream' : 'border-nude text-brown hover:border-brown'}`}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-brown-muted mb-2">Color</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={`${product.id}-color-${color.name}`}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 ${selectedColor.name === color.name ? 'border-rose-gold' : 'border-transparent'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={product.outOfStock || adding}
                onClick={handleAdd}
                className="btn-luxury btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {product.outOfStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Bag'}
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className={`btn-luxury ${wishlisted ? 'btn-primary' : 'btn-outline'}`}
              >
                <Heart size={14} className={wishlisted ? 'fill-current' : ''} />
                {wishlisted ? 'Saved' : 'Save'}
              </button>
            </div>

            <Link
              href={`/product/${product.id}`}
              onClick={onClose}
              className="mt-3 inline-flex text-xs tracking-[0.12em] uppercase text-brown-muted hover:text-brown underline underline-offset-4"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
