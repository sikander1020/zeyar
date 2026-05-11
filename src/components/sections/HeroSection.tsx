'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CoverflowCarousel from '@/components/carousel/CoverflowCarousel';
import type { StoreProduct } from '@/types/storefront';

interface Article {
  _id: string; title: string; slug: string; tag: string;
  excerpt: string; coverImage: string; readTime: string; publishedAt: string | null;
}

/* ─── Shop Now Orb ────────────────────────────────────── */
function ShopOrb() {
  return (
    <Link href="/shop" aria-label="Shop Now">
      <motion.div
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        className="relative w-[88px] h-[88px] cursor-pointer select-none"
      >
        {/* Orb body using CSS vars so it adapts to theme */}
        <div className="w-full h-full rounded-full flex flex-col items-center justify-center glass"
          style={{
            boxShadow: '0 8px 32px rgba(183,110,121,0.28), inset 0 1px 0 rgba(255,255,255,0.7)',
          }}
        >
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-center leading-tight text-brown"
            style={{ fontFamily: "'Inter',sans-serif" }}>
            SHOP<br />NOW
          </span>
        </div>
        {/* Spinning dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute pointer-events-none rounded-full"
          style={{ inset: '-7px', border: '1.5px dashed rgba(183,110,121,0.4)', borderRadius: '50%' }}
        />
      </motion.div>
    </Link>
  );
}

/* ─── Article Carousel ────────────────────────────────── */
function ArticleCarousel({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState(0);
  const total = articles.length;
  if (total === 0) return null;

  const visible = [0, 1, 2].map(i => articles[(active + i) % total]);

  return (
    <section className="py-20 md:py-28 overflow-hidden" style={{ background: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-3 text-rose-gold" style={{ fontFamily: "'Inter',sans-serif" }}>
              From the Journal
            </p>
            <h2 className="text-4xl md:text-5xl text-brown" style={{ fontFamily: "'Playfair Display',serif", lineHeight: 1.08 }}>
              Style &amp; Stories
            </h2>
          </div>
          <div className="flex gap-3 shrink-0">
            {([['prev', <ChevronLeft key="l" size={18} />, () => setActive(p => (p - 1 + total) % total)],
               ['next', <ChevronRight key="r" size={18} />, () => setActive(p => (p + 1) % total)]] as const).map(([lbl, icon, fn]) => (
              <button key={lbl as string} onClick={fn as () => void} aria-label={lbl as string}
                className="w-11 h-11 rounded-full border border-nude flex items-center justify-center text-brown hover:bg-brown hover:text-cream hover:border-brown transition-all duration-300">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {visible.map((art, i) => (
              <article key={art._id + i} className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-beige">
                  {art.coverImage ? (
                    <Image src={art.coverImage} alt={art.title} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw" />
                  ) : (
                    // Brand-aligned gradient fallback using CSS vars
                    <div className="absolute inset-0 gradient-beige" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 bg-nude-light text-brown" style={{ fontFamily: "'Inter',sans-serif" }}>
                    {art.tag}
                  </span>
                  <span className="text-[11px] text-brown-muted" style={{ fontFamily: "'Inter',sans-serif" }}>
                    {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }) : ''} · {art.readTime}
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
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {articles.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Article ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{ width: i === active ? '28px' : '8px', height: '8px', background: i === active ? 'var(--rose-gold)' : 'var(--nude)' }} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function HeroSection() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const [films, setFilms]       = useState<any[]>([]);
  const [isModal, setIsModal]   = useState(false);
  const [activeFilm, setActiveFilm] = useState(0);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [heroErr, setHeroErr]   = useState(false);

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

  return (
    <>
      {/* ══ HERO ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full overflow-hidden"
        style={{ minHeight: '100svh', background: 'var(--beige)' }}>

        {/* Parallax image */}
        <motion.div style={{ y: imgY }} className="absolute inset-0 w-full h-[115%] -top-[5%]">
          {!heroErr ? (
            <Image src="/hero-model.png" alt="ZAYBAASH 2026 Summer Collection"
              fill priority sizes="100vw" className="object-cover object-top"
              onError={() => setHeroErr(true)} />
          ) : (
            <div className="absolute inset-0 gradient-beige" />
          )}
          {/* Bottom vignette so text is legible */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 45%, rgba(20,12,8,0.55) 100%)'
          }} />
        </motion.div>

        {/* ── Season pill ── top-left */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-28 left-8 md:left-12 z-10">
          <span className="text-[10px] tracking-[0.28em] uppercase px-3 py-1.5 rounded-full glass text-brown border-nude/40"
            style={{ fontFamily: "'Inter',sans-serif" }}>
            New Season 2026
          </span>
        </motion.div>

        {/* ── Main headline ── top-left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-6 md:left-12 z-10"
          style={{ top: 'clamp(115px, 20vh, 178px)' }}
        >
          <h1 className="text-brown leading-[0.9] max-w-xs md:max-w-lg"
            style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3rem,7.5vw,7rem)', fontWeight: 700 }}>
            Summer<br /><span className="italic font-light">Collection</span>
          </h1>
        </motion.div>

        {/* ── Shop Now orb ── top-right */}
        <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-28 right-8 md:right-14 z-20">
          <ShopOrb />
        </motion.div>

        {/* ── Bottom editorial strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9 }}
          className="absolute bottom-8 left-0 right-0 z-10 px-6 md:px-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-3">
          <div>
            <p className="text-cream text-2xl md:text-3xl mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>
              2026 — Luxury Summer
            </p>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(250,247,244,0.7)', fontFamily: "'Inter',sans-serif" }}>
              Sun-drenched elegance — premium fabrics crafted for the modern Pakistani woman.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dresses" className="btn-luxury btn-primary text-xs px-5 py-3">
              Shop Dresses
            </Link>
            {films.length > 0 && (
              <button onClick={() => setIsModal(true)}
                className="btn-luxury btn-outline text-xs px-5 py-3 inline-flex items-center gap-2"
                style={{ borderColor: 'rgba(230,183,169,0.5)', color: 'var(--cream)', background: 'rgba(245,237,230,0.12)' }}>
                <Play size={12} className="fill-current" /> Watch Film
              </button>
            )}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-1">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
            className="w-px h-10 bg-nude/60" />
        </motion.div>
      </section>

      {/* ══ TRUST STRIP ════════════════════════════════════ */}
      <section className="border-b border-nude/20" style={{ background: 'var(--beige)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-nude/20">
            {[
              { icon: '✦', label: 'Curated Collection',   sub: 'Every piece hand-selected'  },
              { icon: '◈', label: '100% Premium Quality', sub: 'Luxurious fabrics only'      },
              { icon: '◎', label: 'Nationwide Delivery',  sub: 'Shipped across Pakistan'     },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4 py-8 md:py-10 md:px-10 first:md:pl-0 last:md:pr-0">
                <span className="text-2xl shrink-0 text-rose-gold">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-brown" style={{ fontFamily: "'Inter',sans-serif" }}>{label}</p>
                  <p className="text-xs mt-0.5 text-brown-muted" style={{ fontFamily: "'Inter',sans-serif" }}>{sub}</p>
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
                <p className="text-xs tracking-[0.3em] uppercase mb-3 text-rose-gold" style={{ fontFamily: "'Inter',sans-serif" }}>
                  New Season
                </p>
                <h2 className="text-4xl md:text-5xl text-brown" style={{ fontFamily: "'Playfair Display',serif" }}>
                  Featured <span className="italic gradient-rose-text">Pieces</span>
                </h2>
              </div>
              <Link href="/shop"
                className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase font-medium text-rose-gold hover:gap-3 transition-all duration-300"
                style={{ fontFamily: "'Inter',sans-serif" }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <CoverflowCarousel products={products} />
          </div>
        </section>
      )}

      {/* ══ SEO CONTENT BLOCK ══════════════════════════════ */}
      <section className="py-16 md:py-20 border-t border-b border-nude/20" style={{ background: 'var(--beige)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase mb-4 text-rose-gold" style={{ fontFamily: "'Inter',sans-serif" }}>
              Premium Women's Fashion in Pakistan
            </p>
            <h2 className="text-3xl md:text-4xl leading-tight mb-6 text-brown" style={{ fontFamily: "'Playfair Display',serif" }}>
              Buy Women's Dresses<br />Online in Pakistan
            </h2>
            <p className="text-sm leading-relaxed mb-4 text-brown-muted" style={{ fontFamily: "'Inter',sans-serif" }}>
              ZAYBAASH is the official destination for premium women's fashion in Pakistan. Explore elegant one-piece dresses, tailored two-piece suits, and signature handcrafted styles designed for the modern Pakistani woman.
            </p>
            <p className="text-sm leading-relaxed text-brown-muted" style={{ fontFamily: "'Inter',sans-serif" }}>
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
      <ArticleCarousel articles={articles} />

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
