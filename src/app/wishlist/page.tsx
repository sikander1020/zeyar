'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import AppShell from '@/components/layout/AppShell';
import type { StoreProduct } from '@/types/storefront';

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => res.json() as Promise<{ products?: StoreProduct[] }>)
      .then((data) => {
        if (mounted) setProducts(data.products ?? []);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Map purely by ID, but since products.ts might have dropped some id's, we filter those out.
  const wishlistedProducts = items
    .map(id => products.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your Favorites
            </span>
            <h1 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
              Wish<span className="italic gradient-rose-text">list</span>
            </h1>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-6">
              <Heart size={64} strokeWidth={1} className="text-nude" />
              <h2 className="text-2xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your wishlist is empty
              </h2>
              <p className="text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Save your favorite pieces here to easily find them later.
              </p>
              <Link href="/shop" className="btn-luxury btn-primary mt-4">
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistedProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-beige flex flex-col overflow-hidden group"
                >
                  <Link href={`/product/${product.id}`} className="relative aspect-[3/4] overflow-hidden block">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs tracking-[0.15em] uppercase text-brown-muted font-inter mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {product.category}
                        </p>
                        <h3 className="text-lg font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                          <Link href={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-brown font-inter mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Rs {(product.price * 280).toLocaleString()}
                    </p>

                    <div className="mt-auto flex gap-3">
                      <button
                        disabled={product.outOfStock || product.stock <= 0}
                        onClick={() => {
                          const size = product.sizes[1] || product.sizes[0];
                          const color = product.colors[0];
                          addItem(product, size, color);
                        }}
                        className="btn-luxury btn-primary flex-1 flex justify-center items-center gap-2 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag size={14} /> {product.outOfStock || product.stock <= 0 ? 'Out of Stock' : 'Quick Add'}
                      </button>
                      <button
                        onClick={() => toggle(product.id)}
                        className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-nude text-brown hover:bg-brown hover:text-white transition-colors"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
