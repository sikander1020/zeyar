'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import AppShell from '@/components/layout/AppShell';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your Selection
            </span>
            <h1 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
              Shopping <span className="italic gradient-rose-text">Bag</span>
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-6">
              <ShoppingBag size={64} strokeWidth={1} className="text-nude" />
              <h2 className="text-2xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your bag is empty
              </h2>
              <p className="text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Discover our luxury collections and find pieces that speak to you.
              </p>
              <Link href="/shop" className="btn-luxury btn-primary">
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items list */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item, i) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-6 py-6 border-b border-nude/20"
                  >
                    <div className="relative w-28 h-36 bg-beige flex-shrink-0 overflow-hidden">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs tracking-[0.12em] uppercase text-rose-gold font-inter mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {item.product.category}
                          </p>
                          <h3 className="text-lg font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {item.product.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor.name)}
                          className="p-2 text-brown-muted hover:text-rose-gold transition-colors"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full border border-beige-dark" style={{ backgroundColor: item.selectedColor.hex }} />
                          <span className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{item.selectedColor.name}</span>
                        </div>
                        <span className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>Size: {item.selectedSize}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 border border-nude/40">
                          <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1, item.selectedColor.name)} className="p-2 text-brown hover:text-rose-gold transition-colors">
                            <Minus size={13} strokeWidth={2} />
                          </button>
                          <span className="w-6 text-center text-sm font-inter text-brown" style={{ fontFamily: "'Inter', sans-serif" }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1, item.selectedColor.name)} className="p-2 text-brown hover:text-rose-gold transition-colors">
                            <Plus size={13} strokeWidth={2} />
                          </button>
                        </div>
                        <span className="text-lg font-playfair font-semibold text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                          ${(item.product.price * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-beige p-8 sticky top-28">
                  <h2 className="text-lg font-playfair text-brown mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm font-inter text-brown-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span>Subtotal</span>
                      <span>${total().toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-inter text-brown-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span>Shipping</span>
                      <span className="text-rose-gold">Free</span>
                    </div>
                    <div className="flex justify-between text-sm font-inter text-brown-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span>Estimated Tax</span>
                      <span>${(total() * 0.08).toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="border-t border-nude/30 pt-4 mb-8 flex justify-between">
                    <span className="font-playfair text-brown font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Total</span>
                    <span className="text-xl font-playfair font-semibold text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ${(total() * 1.08).toFixed(0)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <Link href="/checkout" className="btn-luxury btn-primary w-full text-center flex items-center justify-center gap-2">
                      Checkout <ArrowRight size={14} strokeWidth={2} />
                    </Link>
                    <Link href="/shop" className="btn-luxury btn-outline w-full text-center block">
                      Continue Shopping
                    </Link>
                  </div>
                  {/* Trust */}
                  <div className="mt-6 pt-6 border-t border-nude/20">
                    <p className="text-xs text-brown-muted text-center font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                      🔒 Secure 256-bit SSL encryption · We accept all major cards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
