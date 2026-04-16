'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brown/40 backdrop-blur-sm z-[80]"
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-cream z-[90] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-nude/20">
              <div>
                <h2
                  className="text-xl font-playfair text-brown"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Shopping Bag
                </h2>
                <p className="text-xs text-brown-muted font-inter mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 text-brown hover:text-rose-gold transition-colors duration-300"
                aria-label="Close shopping bag"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
                  <ShoppingBag size={48} strokeWidth={1} className="text-nude" />
                  <div>
                    <p className="text-lg font-playfair text-brown mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Your bag is empty
                    </p>
                    <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Discover our luxury collections
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={toggleCart}
                    className="btn-luxury btn-primary inline-block text-center"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4"
                  >
                    <div className="relative w-24 h-32 bg-beige overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3
                          className="text-sm font-playfair text-brown leading-tight pr-2"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor.name)}
                          className="text-brown-muted hover:text-rose-gold transition-colors flex-shrink-0"
                          aria-label={`Remove ${item.product.name} from bag`}
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-xs text-brown-muted mt-1 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Size: {item.selectedSize} · {item.selectedColor.name}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 border border-nude/40">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1, item.selectedColor.name)}
                            className="p-1.5 text-brown hover:text-rose-gold transition-colors"
                            aria-label={`Decrease quantity of ${item.product.name}`}
                          >
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span className="text-sm font-medium text-brown w-5 text-center font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1, item.selectedColor.name)}
                            className="p-1.5 text-brown hover:text-rose-gold transition-colors"
                            aria-label={`Increase quantity of ${item.product.name}`}
                          >
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Rs {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-nude/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Subtotal
                  </span>
                  <span className="text-lg font-playfair font-semibold text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Rs {total().toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-brown-muted font-inter text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Shipping calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="btn-luxury btn-primary w-full text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={toggleCart}
                  className="btn-luxury btn-outline w-full text-center block"
                >
                  View Full Bag
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
