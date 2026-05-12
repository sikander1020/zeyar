'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  ShoppingBag, 
  Eye, 
  Scissors, 
  Award, 
  Compass, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useToast } from '@/components/layout/ToastProvider';
import { AttributeCard } from '@/components/storefront/AttributeCard';
import ProductQuickViewModal from '@/components/storefront/ProductQuickViewModal';
import type { StoreProduct } from '@/types/storefront';

export default function SignatureDressExperience({ products }: { products: StoreProduct[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'story' | 'craft' | 'sizing'>('story');
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { toast } = useToast();

  const currentProduct = products[activeIndex] || products[0];

  // Reset image index when switching active piece
  const handleSelectProduct = (index: number) => {
    setActiveIndex(index);
    setActiveImageIndex(0);
    setSelectedTab('story');
  };

  const wishlisted = currentProduct ? isWishlisted(currentProduct.id) : false;

  const handlePreOrder = () => {
    if (!currentProduct || isAdding) return;
    setIsAdding(true);
    const size = currentProduct.sizes[1] || currentProduct.sizes[0] || 'M';
    const color = currentProduct.colors[0] || { name: 'Default', hex: '#E6B7A9' };
    
    addItem(currentProduct, size, color);
    toast({
      type: 'success',
      title: 'Handcrafted Piece Pre-Ordered',
      message: `${currentProduct.name} has been added to your bag.`,
      hasCheckout: true,
    });

    setTimeout(() => setIsAdding(false), 600);
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-xl font-playfair text-brown">The Masterpiece Collection is currently updating.</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      {/* Editorial Banner */}
      <section className="relative overflow-hidden border-b border-nude/20 gradient-beige py-12 md:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(circle at 10% 20%, rgba(183,110,121,0.12) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(58,46,42,0.08) 0%, transparent 40%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-rose-gold/30 bg-white/80 px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase text-rose-gold mb-4 shadow-sm"
          >
            <Sparkles size={12} className="animate-pulse" />
            Haute Couture Exclusive
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-playfair text-brown tracking-tight"
          >
            The Atelier <span className="italic gradient-rose-text">Masterpieces</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-sm md:text-base text-brown-muted font-inter max-w-2xl mx-auto leading-relaxed"
          >
            Reserved solely for our house iconic pieces. Browse our hyper-premium lineup below and interact with every bespoke curve, fabric detail, and hand-stitched embellishment.
          </motion.p>
        </div>

        {/* Masterpiece Thumbnail Ribbon */}
        {products.length > 1 && (
          <div className="mt-10 max-w-5xl mx-auto px-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-brown-muted text-center mb-3">
              Select a Masterpiece to Inspect
            </p>
            <div className="flex justify-center gap-2.5 overflow-x-auto pb-2 px-2 hide-scrollbar">
              {products.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProduct(idx)}
                  className={`group relative flex items-center gap-3.5 rounded-xl border p-2 text-left transition-all duration-300 w-[200px] shrink-0 ${
                    activeIndex === idx
                      ? 'bg-white border-rose-gold shadow-md ring-1 ring-rose-gold/20'
                      : 'bg-white/60 border-nude/40 hover:bg-white/90 hover:border-brown/30'
                  }`}
                >
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-beige shrink-0">
                    <Image
                      src={p.images[0] || ''}
                      alt={p.name}
                      fill
                      sizes="48px"
                      className="object-cover object-top transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-rose-gold font-semibold truncate">
                      Piece {idx + 1}
                    </p>
                    <p className="text-xs font-playfair text-brown font-medium truncate">
                      {p.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Primary Immersive Spotlight Feature */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          >
            {/* Left Column: Multi-Perspective Interactive Gallery */}
            <div className="lg:col-span-7 lg:sticky lg:top-28">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Thumbnails Stripe */}
                <div className="flex sm:flex-col gap-2.5 order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] hide-scrollbar pb-2 sm:pb-0 shrink-0">
                  {currentProduct.images.map((imgSrc, imgIdx) => (
                    <button
                      key={imgSrc}
                      onClick={() => setActiveImageIndex(imgIdx)}
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border transition-all duration-300 shrink-0 ${
                        activeImageIndex === imgIdx
                          ? 'border-rose-gold ring-2 ring-rose-gold/20 shadow-sm'
                          : 'border-nude/40 opacity-70 hover:opacity-100 hover:border-brown/40'
                      }`}
                    >
                      <Image
                        src={imgSrc}
                        alt={`${currentProduct.name} view ${imgIdx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover object-top"
                      />
                      <div className="absolute bottom-1 right-1 bg-brown/80 rounded px-1 text-[8px] text-cream font-inter">
                        {imgIdx + 1}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Primary High-Res Stage */}
                <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#F9F5F2] border border-nude/30 aspect-[3/4] order-1 sm:order-2 group shadow-[0_20px_50px_rgba(58,46,42,0.08)]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImageIndex}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentProduct.images[activeImageIndex] || currentProduct.images[0]}
                        alt={currentProduct.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="glass rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-brown border border-nude/40 shadow-sm font-medium">
                      Angle {activeImageIndex + 1} of {currentProduct.images.length}
                    </span>
                  </div>

                  <div className="absolute bottom-4 inset-x-4 z-10 pointer-events-none flex justify-between items-end">
                    <div className="bg-white/90 backdrop-blur-md border border-nude/30 rounded-xl px-3 py-2 pointer-events-auto shadow-sm">
                      <p className="text-[9px] tracking-[0.15em] uppercase text-brown-muted m-0">Click thumbnail to switch perspective</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(currentProduct)}
                      className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-brown hover:bg-brown hover:text-white transition-all pointer-events-auto shadow-md"
                      aria-label="Launch 360 inspection"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Deep Dive Editorial Suite */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-xs tracking-[0.25em] uppercase text-rose-gold font-semibold font-inter block">
                    Handcrafted Line
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-brown-muted font-inter bg-beige px-2.5 py-1 rounded-full border border-nude/30">
                    <Award size={12} className="text-rose-gold" />
                    Loved by {currentProduct.lovedByCount || 124} women
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-playfair text-brown leading-tight mb-2">
                  {currentProduct.name}
                </h2>

                {/* Price Feature */}
                <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-nude/40">
                  <span className="text-2xl font-semibold text-brown font-inter tracking-tight">
                    Rs {currentProduct.price.toLocaleString()}
                  </span>
                  {currentProduct.originalPrice && (
                    <span className="text-sm text-brown-muted line-through font-inter">
                      Rs {currentProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[10px] tracking-[0.1em] uppercase text-green-700 bg-green-50 border border-green-200/60 rounded px-2 py-0.5 ml-auto font-medium font-inter">
                    Pre-Order Open
                  </span>
                </div>

                {/* Attributes Mesh */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <AttributeCard
                    label="Finest Fabric"
                    value={currentProduct.fabric || 'Pure Raw Silk & Net'}
                    icon={Scissors}
                  />
                  <AttributeCard
                    label="Artisanal Craft"
                    value={currentProduct.craft || 'Zardozi, Resham & Stones'}
                    icon={Sparkles}
                  />
                  <AttributeCard
                    label="Collection Vault"
                    value={currentProduct.line || 'House Signature Heritage'}
                    icon={Award}
                  />
                  <AttributeCard
                    label="Tailoring Style"
                    value="Bespoke Slow Finish"
                    icon={Compass}
                  />
                </div>

                {/* Deep Dive Sub-tabs */}
                <div className="mb-6">
                  <div className="flex border-b border-nude/40 gap-6 mb-4">
                    {(['story', 'craft', 'sizing'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`pb-2 text-xs tracking-[0.15em] uppercase font-inter relative transition-colors ${
                          selectedTab === tab
                            ? 'text-brown font-semibold'
                            : 'text-brown-muted hover:text-brown'
                        }`}
                      >
                        {tab === 'story' && 'The Vision'}
                        {tab === 'craft' && 'Craft & Care'}
                        {tab === 'sizing' && 'Atelier Fit'}
                        {selectedTab === tab && (
                          <motion.div 
                            layoutId="signatureTabIndicator"
                            className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-gold"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-brown-muted font-inter leading-relaxed space-y-3 min-h-[120px]"
                    >
                      {selectedTab === 'story' && (
                        <>
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {currentProduct.description || 
                              'An exquisite embodiment of supreme Pakistani craftsmanship. Tailored precisely from luxurious threadwork, designed to cascade elegantly for a truly regal silhouette.'}
                          </p>
                          <div className="pt-2 flex items-center gap-2 text-xs text-brown">
                            <Check size={14} className="text-rose-gold" />
                            <span>Authentic limited edition atelier seal included</span>
                          </div>
                        </>
                      )}

                      {selectedTab === 'craft' && (
                        <ul className="space-y-2 list-none m-0 p-0">
                          {(currentProduct.details && currentProduct.details.length > 0 ? currentProduct.details : [
                            'Hand-embroidered front panels with crystal sequencing.',
                            'Pure gossamer dupattas with classic metallic fringing.',
                            'Tailored inside lining ensuring structural luxury.',
                            'Dry clean strictly recommended to preserve metallic threads.'
                          ]).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-gold mt-1.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {selectedTab === 'sizing' && (
                        <div>
                          <p className="text-xs mb-3">
                            Our signature dresses follow tailored slow finishing. Review specific body sizing blocks below:
                          </p>
                          <div className="grid grid-cols-4 gap-2 text-[11px] text-center font-medium bg-beige/50 p-2.5 rounded-xl border border-nude/30">
                            <div>
                              <span className="block text-[9px] text-brown-muted uppercase">Size</span>
                              <span className="text-brown font-semibold">Small</span>
                            </div>
                            <div>
                              <span className="block text-[9px] text-brown-muted uppercase">Chest</span>
                              <span className="text-brown">36&quot;</span>
                            </div>
                            <div>
                              <span className="block text-[9px] text-brown-muted uppercase">Waist</span>
                              <span className="text-brown">30&quot;</span>
                            </div>
                            <div>
                              <span className="block text-[9px] text-brown-muted uppercase">Hips</span>
                              <span className="text-brown">38&quot;</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-brown-muted italic mt-2 text-center">
                            Need bespoke measurement alignment? Reach out to support after reserving your piece.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Suite */}
              <div className="pt-6 border-t border-nude/40 mt-4 space-y-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={isAdding}
                    onClick={handlePreOrder}
                    className="flex-1 h-14 rounded-xl bg-brown text-cream text-xs tracking-[0.18em] uppercase font-semibold font-inter flex items-center justify-center gap-2 hover:bg-brown/90 shadow-lg hover:shadow-xl transition-all active:scale-[0.99] disabled:opacity-75 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <ShoppingBag size={16} className="text-rose-gold" />
                    {isAdding ? 'Reserving Piece...' : 'Pre-Order Handcrafted Piece'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const wasWishlisted = isWishlisted(currentProduct.id);
                      toggle(currentProduct.id);
                      toast({
                        type: 'success',
                        title: wasWishlisted ? 'Removed from Vault' : 'Saved to Signature Vault',
                        message: currentProduct.name,
                      });
                    }}
                    className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                      wishlisted
                        ? 'bg-rose-gold border-rose-gold text-white shadow-md'
                        : 'bg-white border-nude/40 text-brown hover:border-brown hover:bg-beige'
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart size={18} className={wishlisted ? 'fill-current' : ''} strokeWidth={1.6} />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-6 text-[10px] tracking-[0.1em] uppercase text-brown-muted pt-2 font-inter">
                  <span className="inline-flex items-center gap-1">
                    <Check size={12} className="text-green-600" /> Pure Fabrics
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Check size={12} className="text-green-600" /> Secure Checkout
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Check size={12} className="text-green-600" /> Nationwide Priority COD
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Atelier Philosophy Banner */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="rounded-3xl border border-nude/30 bg-[#F5ECE6] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none bg-[radial-gradient(#9B4F5C_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-2xl">
            <span className="text-[10px] tracking-[0.3em] uppercase text-rose-gold font-semibold block mb-2">
              The House Commitment
            </span>
            <h3 className="text-2xl sm:text-3xl font-playfair text-brown leading-tight">
              Slow Fashion, Crafted Unforgettable
            </h3>
            <p className="mt-4 text-sm text-brown-muted font-inter leading-relaxed">
              We stand apart from quick commercial runs. Every single piece in the Signature line receives personalized monitoring by seasoned artisans. From custom dyeing runs to intricate sequin arrays sewn meticulously by hand, our priority remains heirloom-tier luxury designed to illuminate your statement occasions.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="text-xs font-semibold text-brown font-playfair italic">Sikandar Jadoon</span>
              <span className="text-nude">—</span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-brown-muted font-inter">Creative Director</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Overview of All Signature Pieces */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 mb-8 border-b border-nude/40 pb-4">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-rose-gold font-semibold font-inter block mb-1">
              Visual Comparison
            </span>
            <h3 className="text-2xl font-playfair text-brown">
              The Complete Signature Lineup
            </h3>
          </div>
          <p className="text-xs text-brown-muted font-inter">
            Showing all {products.length} statement masterpieces
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, idx) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`group rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col ${
                activeIndex === idx
                  ? 'bg-white border-rose-gold shadow-md ring-1 ring-rose-gold/20'
                  : 'bg-white/70 border-nude/40 hover:bg-white hover:border-brown/40 hover:shadow-sm'
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-beige">
                <Image
                  src={p.images[0] || ''}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-brown/80 rounded px-2.5 py-1 text-[9px] tracking-[0.15em] uppercase text-cream font-medium">
                  Piece {idx + 1}
                </div>
                {activeIndex === idx && (
                  <div className="absolute top-3 right-3 bg-rose-gold text-white rounded-full p-1 shadow">
                    <Check size={12} strokeWidth={2.5} />
                  </div>
                )}
                <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectProduct(idx)}
                    className="flex-1 py-2 bg-brown/95 backdrop-blur text-cream text-[10px] tracking-[0.15em] uppercase font-semibold rounded hover:bg-brown transition-colors text-center font-inter"
                  >
                    {activeIndex === idx ? 'Inspecting' : 'Inspect Piece'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(p)}
                    className="w-8 h-8 bg-white/95 backdrop-blur text-brown rounded flex items-center justify-center hover:bg-rose-gold hover:text-white transition-colors"
                    aria-label="Quick View"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-brown-muted font-inter mb-1">
                    {p.category}
                  </p>
                  <h4 className="text-base font-playfair text-brown font-medium leading-snug group-hover:text-rose-gold transition-colors">
                    <button onClick={() => handleSelectProduct(idx)} className="text-left">
                      {p.name}
                    </button>
                  </h4>
                </div>
                <div className="pt-3 mt-3 border-t border-nude/20 flex items-center justify-between">
                  <span className="text-sm font-semibold text-brown font-inter">
                    Rs {p.price.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectProduct(idx)}
                    className="inline-flex items-center gap-1 text-xs text-rose-gold hover:underline font-inter font-medium"
                  >
                    View Details <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Modal Quick View Integration */}
      <ProductQuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </div>
  );
}
