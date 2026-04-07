'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, ChevronDown, ChevronLeft, Share2, Package, RotateCcw, Truck } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import AppShell from '@/components/layout/AppShell';
import dynamic from 'next/dynamic';
import { notFound, useParams } from 'next/navigation';

const ProductViewer = dynamic(() => import('@/components/3d/ProductViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-beige animate-pulse flex items-center justify-center">
      <span className="text-brown-muted text-sm font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>Loading 3D View...</span>
    </div>
  ),
});

export default function ProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = products.find(p => p.id === id);

  // We have to move hook calls below, but if product is not found we want to show 404.
  // In a real app we'd do this in a server component. Here we can return notFound() early if hydration allows,
  // or return it after hooks if needed. Let's initialize hooks safely.
  
  const [selectedSize, setSelectedSize] = useState(product?.sizes[1] || product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || { name: '', hex: '' });
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'3d' | 'images'>('3d');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const addItem = useCartStore(s => s.addItem);
  const toggleCart = useCartStore(s => s.toggleCart);
  const { toggle, isWishlisted } = useWishlistStore();
  
  if (!product) return notFound();

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedColor);
    toggleCart();
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <AppShell>
      <div className="pt-24 bg-cream min-h-screen">
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
              {/* Tab switcher */}
              <div className="flex mb-4 border border-nude/30">
                <button
                  onClick={() => setActiveTab('3d')}
                  className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase font-inter transition-all duration-300 ${activeTab === '3d' ? 'bg-brown text-cream' : 'text-brown-muted hover:text-brown'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  3D View
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase font-inter transition-all duration-300 ${activeTab === 'images' ? 'bg-brown text-cream' : 'text-brown-muted hover:text-brown'}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Gallery
                </button>
              </div>

              {activeTab === '3d' ? (
                <div className="relative aspect-square bg-gradient-to-br from-beige to-cream-dark rounded-none overflow-hidden">
                  <div className="absolute inset-0">
                    <ProductViewer color={selectedColor.hex} />
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 text-xs text-brown-muted font-inter tracking-[0.1em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Drag to rotate · Tap to interact
                  </div>
                </div>
              ) : (
                <div>
                  <div className="aspect-square relative overflow-hidden bg-beige mb-3">
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
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
              )}
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
                  <button className="p-2 border border-nude text-brown hover:border-rose-gold hover:text-rose-gold transition-all duration-300">
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
                  Rs {(product.price * 280).toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-brown-muted line-through font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Rs {(product.originalPrice * 280).toLocaleString()}
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
                      onClick={() => setSelectedColor(color)}
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
                  <button className="text-xs underline text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[52px] py-2.5 px-3 border text-xs font-semibold font-inter transition-all duration-300 ${selectedSize === size ? 'bg-brown text-cream border-brown' : 'border-nude text-brown hover:border-brown'}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart */}
              <div className="flex gap-3 mb-8">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="btn-luxury btn-primary flex-1 flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={15} strokeWidth={2} />
                  Add to Bag
                </motion.button>
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
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl font-playfair text-brown mb-10 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                You May Also <span className="italic gradient-rose-text">Love</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {related.map(p => (
                  <Link key={p.id} href={`/product/${p.id}`} className="group product-card">
                    <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-4">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <h3 className="text-sm font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}</h3>
                    <p className="text-sm text-brown-muted font-inter mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Rs {(p.price * 280).toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
