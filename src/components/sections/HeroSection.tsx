'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, X, ChevronRight, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CoverflowCarousel from '@/components/carousel/CoverflowCarousel';
import type { StoreProduct } from '@/types/storefront';

interface Article {
  _id: string; title: string; slug: string; tag: string;
  excerpt: string; coverImage: string; readTime: string; publishedAt: string | null;
}

export default function HeroSection() {
  const router = useRouter();

  const [films, setFilms]       = useState<any[]>([]);
  const [isModal, setIsModal]   = useState(false);
  const [activeFilm, setActiveFilm] = useState(0);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Hero Carousel State
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  useEffect(() => {
    router.prefetch('/shop');
    router.prefetch('/dresses');

    fetch('/api/products?sort=newest&limit=12')
      .then(r => r.json()).then(d => { if (Array.isArray(d.products)) setProducts(d.products); })
      .catch(() => {});

    fetch('/api/articles?limit=6')
      .then(r => r.json()).then(d => { if (Array.isArray(d.articles)) setArticles(d.articles); })
      .catch(() => {});

    fetch('/api/campaign-films')
      .then(r => r.json()).then(d => { if (Array.isArray(d)) setFilms(d); })
      .catch(() => {});
  }, [router]);

  // Use up to 4 products for the hero lookbook
  const heroProducts = products.length > 0 ? products.slice(0, 4) : [];
  
  // Auto-advance hero
  useEffect(() => {
    if (heroProducts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveHeroIdx(prev => (prev + 1) % heroProducts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  return (
    <>
      {/* ══ DRIBBBLE-INSPIRED SPLIT HERO ═════════════════════════════════ */}
      <section className="relative w-full min-h-[100svh] flex flex-col-reverse lg:flex-row overflow-hidden pt-20 lg:pt-0"
        style={{ background: 'var(--cream)' }}>
        
        {/* Left Content Half */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 md:px-12 lg:pl-16 xl:pl-24 pt-12 pb-10 lg:py-0 relative z-10">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeHeroIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-xl"
            >
              {/* Category / Season */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-rose-gold"></div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-rose-gold font-medium" style={{ fontFamily: "'Inter',sans-serif" }}>
                  {heroProducts[activeHeroIdx]?.category || 'New Season 2026'}
                </span>
              </div>

              {/* Huge Serif Headline */}
              <h1 className="text-brown leading-[1.05] mb-6"
                style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', fontWeight: 600 }}>
                {heroProducts.length > 0 ? (
                  <>
                    {heroProducts[activeHeroIdx].name.split(' ')[0]}<br />
                    <span className="italic font-light text-brown-muted">
                      {heroProducts[activeHeroIdx].name.split(' ').slice(1).join(' ')}
                    </span>
                  </>
                ) : (
                  <>Summer<br /><span className="italic font-light text-brown-muted">Collection</span></>
                )}
              </h1>

              <p className="text-brown-muted text-sm md:text-base leading-relaxed mb-10 max-w-md" style={{ fontFamily: "'Inter',sans-serif" }}>
                Discover sun-drenched elegance. Premium fabrics crafted for the modern Pakistani woman, featuring timeless silhouettes and luxurious details.
              </p>

              {/* Discover Button */}
              <Link href={heroProducts[activeHeroIdx] ? `/product/${heroProducts[activeHeroIdx].id}` : '/shop'}
                className="group inline-flex items-center gap-4 bg-brown text-cream px-8 py-4 rounded-full text-xs tracking-[0.15em] uppercase hover:bg-rose-gold transition-colors duration-300">
                Discover the collection
                <span className="bg-cream/20 rounded-full p-1.5 group-hover:bg-cream/30 transition-colors">
                  <ArrowRight size={14} className="text-cream" />
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Lookbook Thumbnails (Bottom Left) */}
          <div className="mt-16 lg:absolute lg:bottom-12 flex gap-4">
            {heroProducts.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveHeroIdx(i)}
                className={`relative w-16 h-20 md:w-20 md:h-24 overflow-hidden rounded-lg transition-all duration-500 cursor-pointer ${
                  i === activeHeroIdx ? 'ring-2 ring-rose-gold ring-offset-2 ring-offset-[var(--cream)] scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={p.images[0] || '/hero-model.png'} alt={p.name} fill className="object-cover object-top" sizes="80px" />
                <div className={`absolute inset-0 bg-black/20 transition-opacity ${i === activeHeroIdx ? 'opacity-0' : 'opacity-100'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Image Half */}
        <div className="w-full h-[60vh] lg:flex-1 lg:h-auto relative overflow-hidden bg-beige lg:mt-[104px] lg:mb-12 lg:mr-12 lg:rounded-2xl lg:shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${activeHeroIdx}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full"
            >
              {heroProducts.length > 0 ? (
                <Image src={heroProducts[activeHeroIdx].images[0] || '/hero-model.png'} alt="Featured Product"
                  fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover object-top" />
              ) : (
                <div className="absolute inset-0 gradient-beige" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Watch Film Floating Button (Right side) */}
          {films.length > 0 && (
            <button onClick={() => setIsModal(true)}
              className="absolute bottom-8 right-8 z-20 flex items-center gap-3 px-6 py-3 rounded-full text-xs tracking-[0.16em] uppercase font-medium transition-all hover:scale-105 glass-dark"
              style={{ color: 'var(--cream)', fontFamily: "'Inter',sans-serif", border: '1px solid rgba(255,255,255,0.2)' }}>
              <div className="w-6 h-6 rounded-full bg-cream/20 flex items-center justify-center">
                <Play size={10} className="fill-current" />
              </div>
              Watch Film
            </button>
          )}
        </div>
      </section>

      {/* ══ TRUST STRIP ════════════════════════════════════ */}
      <section className="border-b" style={{ background: 'var(--beige)', borderColor: 'rgba(230,183,169,0.2)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ ['--tw-divide-opacity' as any]: '1', borderColor: 'rgba(230,183,169,0.22)' }}>
            {[
              { icon: '✦', label: 'Curated Collection',   sub: 'Every piece hand-selected'  },
              { icon: '◈', label: '100% Premium Quality', sub: 'Luxurious fabrics only'      },
              { icon: '◎', label: 'Nationwide Delivery',  sub: 'Shipped across Pakistan'     },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4 py-8 md:py-10 md:px-10 first:md:pl-0 last:md:pr-0">
                <span className="text-2xl shrink-0" style={{ color: 'var(--rose-gold)' }}>{icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--brown)', fontFamily: "'Inter',sans-serif" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--brown-muted)', fontFamily: "'Inter',sans-serif" }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3D PRODUCT CAROUSEL ════════════════════════════ */}
      {products.length > 0 && (
        <section className="py-16 md:py-24 overflow-hidden" style={{ background: 'var(--cream-dark)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--rose-gold)', fontFamily: "'Inter',sans-serif" }}>
                  New Season
                </p>
                <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--brown)' }}>
                  Featured <span className="italic gradient-rose-text">Pieces</span>
                </h2>
              </div>
              <Link href="/shop"
                className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase font-medium hover:gap-3 transition-all duration-300"
                style={{ color: 'var(--rose-gold)', fontFamily: "'Inter',sans-serif" }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <CoverflowCarousel products={products} />
          </div>
        </section>
      )}

      {/* ══ SEO CONTENT BLOCK ══════════════════════════════ */}
      <section className="py-16 md:py-20 border-t border-b" style={{ background: 'var(--beige)', borderColor: 'rgba(230,183,169,0.18)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase mb-4" style={{ color: 'var(--rose-gold)', fontFamily: "'Inter',sans-serif" }}>
              Premium Women's Fashion in Pakistan
            </p>
            <h2 className="text-3xl md:text-4xl leading-tight mb-6" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--brown)' }}>
              Buy Women's Dresses<br />Online in Pakistan
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--brown-muted)', fontFamily: "'Inter',sans-serif" }}>
              ZAYBAASH is the official destination for premium women's fashion in Pakistan. Explore elegant one-piece dresses, tailored two-piece suits, and signature handcrafted styles designed for the modern Pakistani woman.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)', fontFamily: "'Inter',sans-serif" }}>
              Shop with confidence — nationwide delivery, reliable support, and carefully curated seasonal collections.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { href: '/dresses',         label: "Shop Women's Dresses"    },
              { href: '/shop',            label: 'Browse Full Collection'   },
              { href: '/signature-dress', label: 'Explore Signature Dress' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="btn-luxury btn-outline w-full text-center">{label}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ARTICLE CAROUSEL (only if articles exist in DB) ═ */}
      {articles.length > 0 && (
        <section className="py-20 md:py-28 overflow-hidden" style={{ background: 'var(--cream)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-3 text-rose-gold" style={{ fontFamily: "'Inter',sans-serif" }}>
                  From the Journal
                </p>
                <h2 className="text-4xl md:text-5xl text-brown" style={{ fontFamily: "'Playfair Display',serif", lineHeight: 1.08 }}>
                  Style &amp; Stories
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.slice(0, 3).map((art, i) => (
                <article key={art._id + i} className="group cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-beige rounded-xl">
                    {art.coverImage ? (
                      <Image src={art.coverImage} alt={art.title} fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width:768px) 100vw, 33vw" />
                    ) : (
                      <div className="absolute inset-0 gradient-beige" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm" style={{ background: 'var(--nude-light)', color: 'var(--brown)', fontFamily: "'Inter',sans-serif" }}>
                      {art.tag}
                    </span>
                    <span className="text-[11px] text-brown-muted" style={{ fontFamily: "'Inter',sans-serif" }}>
                      {art.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl leading-snug mb-3 text-brown group-hover:text-rose-gold transition-colors duration-300"
                    style={{ fontFamily: "'Playfair Display',serif" }}>
                    {art.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 text-brown-muted line-clamp-3" style={{ fontFamily: "'Inter',sans-serif" }}>
                    {art.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase font-medium text-rose-gold group-hover:gap-3 transition-all duration-300"
                    style={{ fontFamily: "'Inter',sans-serif" }}>
                    Read Article <ArrowRight size={12} />
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ VIDEO MODAL ════════════════════════════════════ */}
      <AnimatePresence>
        {isModal && films.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brown/90 backdrop-blur-sm p-4"
            onClick={() => setIsModal(false)}>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col shadow-2xl"
              style={{ background: 'var(--brown)' }}
              onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-cream hover:bg-black/70 transition-all"
                onClick={() => setIsModal(false)}>
                <X size={20} />
              </button>
              <div className="relative w-full aspect-video bg-black">
                <video key={films[activeFilm]?.videoUrl} src={films[activeFilm]?.videoUrl}
                  controls autoPlay className="w-full h-full object-contain" />
              </div>
              {films.length > 1 && (
                <div className="p-4 border-t border-nude/20 flex gap-3 overflow-x-auto">
                  {films.map((f, i) => (
                    <button key={f._id} onClick={() => setActiveFilm(i)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${i === activeFilm ? 'bg-rose-gold text-cream' : 'bg-cream/10 text-cream/70 hover:bg-cream/20'}`}
                      style={{ fontFamily: "'Inter',sans-serif" }}>
                      {f.title}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
