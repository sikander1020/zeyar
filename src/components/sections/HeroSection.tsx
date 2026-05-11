'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CoverflowCarousel from '@/components/carousel/CoverflowCarousel';
import type { StoreProduct } from '@/types/storefront';

/* ─── Types ──────────────────────────────────────────── */
interface Article {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  coverImage: string;
  readTime: string;
  publishedAt: string | null;
}

/* ─── Shop Now Orb ───────────────────────────────────── */
function ShopOrb() {
  return (
    <Link href="/shop" aria-label="Shop Now">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-24 h-24 cursor-pointer select-none"
      >
        <div
          className="w-full h-full rounded-full flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.88) 0%, rgba(245,237,230,0.72) 55%, rgba(230,183,169,0.55) 100%)',
            border: '1px solid rgba(255,255,255,0.85)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 32px rgba(183,110,121,0.28)',
          }}
        >
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-center leading-tight" style={{ color: 'var(--brown)', fontFamily: "'Inter',sans-serif" }}>
            SHOP<br />NOW
          </span>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full pointer-events-none"
          style={{ inset: '-6px', border: '1.5px dashed rgba(183,110,121,0.38)', borderRadius: '50%' }}
        />
      </motion.div>
    </Link>
  );
}

/* ─── Article Carousel ───────────────────────────────── */
function ArticleCarousel({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState(0);
  const total = articles.length;
  const prev = () => setActive(p => (p - 1 + total) % total);
  const next = () => setActive(p => (p + 1) % total);

  if (total === 0) return null;

  // Show 3 at a time: active, active+1, active+2
  const visible = [0, 1, 2].map(offset => articles[(active + offset) % total]);

  return (
    <section className="py-20 md:py-28 overflow-hidden" style={{ background: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--rose-gold)', fontFamily: "'Inter',sans-serif" }}>
              From the Journal
            </p>
            <h2 className="text-4xl md:text-5xl leading-[1.08]" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--brown)' }}>
              Style &amp; Stories
            </h2>
          </div>
          <div className="flex gap-3 shrink-0">
            {[{ fn: prev, icon: <ChevronLeft size={18} />, label: 'Prev' }, { fn: next, icon: <ChevronRight size={18} />, label: 'Next' }].map(({ fn, icon, label }) => (
              <button
                key={label} onClick={fn} aria-label={label}
                className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300"
                style={{ borderColor: 'var(--nude)', color: 'var(--brown)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--brown)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'var(--brown)'; }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {visible.map((article, i) => (
              <article key={article._id + i} className="group cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-beige">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: [
                          'linear-gradient(135deg,#F5EDE6 0%,#E6B7A9 50%,#C58D7D 100%)',
                          'linear-gradient(135deg,#EBD9CC 0%,#D4957F 50%,#B76E79 100%)',
                          'linear-gradient(135deg,#FAF7F4 0%,#F0C9BF 45%,#D4957F 100%)',
                        ][i % 3],
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                {/* Meta */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] tracking-[0.18em] uppercase px-2 py-0.5" style={{ background: 'var(--nude-light)', color: 'var(--brown)', fontFamily: "'Inter',sans-serif" }}>
                    {article.tag}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--brown-muted)', fontFamily: "'Inter',sans-serif" }}>
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }) : ''} · {article.readTime}
                  </span>
                </div>
                <h3 className="text-xl leading-snug mb-3 transition-colors duration-300 group-hover:text-rose-gold" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--brown)' }}>
                  {article.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--brown-muted)', fontFamily: "'Inter',sans-serif" }}>
                  {article.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase font-medium group-hover:gap-3 transition-all duration-300" style={{ color: 'var(--rose-gold)', fontFamily: "'Inter',sans-serif" }}>
                  Read Article <ArrowRight size={12} />
                </span>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {articles.map((_, i) => (
            <button
              key={i} onClick={() => setActive(i)} aria-label={`Article ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{ width: i === active ? '28px' : '8px', height: '8px', background: i === active ? 'var(--rose-gold)' : 'var(--nude)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main HeroSection ───────────────────────────────── */
export default function HeroSection() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const [films, setFilms]           = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilm, setActiveFilm]   = useState(0);
  const [products, setProducts]       = useState<StoreProduct[]>([]);
  const [articles, setArticles]       = useState<Article[]>([]);
  const [imgErr, setImgErr]           = useState(false);
  const [womenErr, setWomenErr]       = useState(false);

  useEffect(() => {
    router.prefetch('/shop');
    router.prefetch('/dresses');

    // Load products for carousel
    fetch('/api/products?sort=newest&limit=12')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.products)) setProducts(d.products); })
      .catch(() => {});

    // Load published articles
    fetch('/api/articles?limit=6')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.articles)) setArticles(d.articles); })
      .catch(() => {});

    // Load campaign films
    fetch('/api/campaign-films')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setFilms(d); })
      .catch(() => {});
  }, [router]);

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '100svh', background: 'var(--beige)' }}
      >
        {/* Parallax background */}
        <motion.div style={{ y: imgY }} className="absolute inset-0 w-full h-[115%] -top-[5%]">
          {!imgErr ? (
            <Image
              src="/hero-model.png"
              alt="ZAYBAASH 2026 Summer Collection"
              fill priority sizes="100vw"
              className="object-cover object-top"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#F5EDE6 0%,#EBD9CC 25%,#E6B7A9 55%,#C58D7D 80%,#9B6B5A 100%)' }} />
          )}
          {/* Dark vignette bottom */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(245,237,230,0.12) 0%, transparent 40%, rgba(20,14,12,0.48) 100%)' }} />
        </motion.div>

        {/* Season pill — top left */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-28 left-8 md:left-12 z-10"
        >
          <span className="text-[10px] tracking-[0.28em] uppercase px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(245,237,230,0.78)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(230,183,169,0.5)', color: 'var(--brown)', fontFamily: "'Inter',sans-serif" }}>
            New Season 2026
          </span>
        </motion.div>

        {/* Main heading — top left (below pill) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-6 md:left-12 z-10"
          style={{ top: 'clamp(110px, 20vh, 175px)' }}
        >
          <h1
            className="leading-[0.9] max-w-xs md:max-w-lg"
            style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3rem, 7.5vw, 7rem)', color: 'var(--brown)', fontWeight: 700 }}
          >
            Summer<br />
            <span className="italic font-light">Collection</span>
          </h1>
        </motion.div>

        {/* Shop Now orb — top right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-28 right-8 md:right-14 z-20"
        >
          <ShopOrb />
        </motion.div>

        {/* Women Collection card — bottom left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.72 }}
          className="absolute bottom-20 left-4 md:left-10 z-20 w-36 md:w-44"
        >
          <Link href="/dresses" className="group block">
            <div className="relative aspect-[3/4] overflow-hidden shadow-xl">
              {!womenErr ? (
                <Image
                  src="/collection-women.png" alt="Women Collection" fill sizes="176px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  onError={() => setWomenErr(true)}
                />
              ) : (
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg,#F5EDE6 0%,#E6B7A9 60%,#B76E79 100%)' }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brown/60 to-transparent" />
              <span className="absolute bottom-2.5 left-0 right-0 text-center text-[8px] md:text-[9px] tracking-[0.22em] uppercase font-semibold" style={{ color: 'var(--cream)', fontFamily: "'Inter',sans-serif" }}>
                Women Collection
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Signature Dress card — bottom right */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.88 }}
          className="absolute bottom-20 right-4 md:right-10 z-20 w-36 md:w-44"
        >
          <Link href="/signature-dress" className="group block">
            <div className="relative aspect-[3/4] overflow-hidden shadow-xl flex flex-col items-center justify-center" style={{ background: 'var(--brown)' }}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%,rgba(230,183,169,0.5) 0%,transparent 70%)' }} />
              <span className="relative z-10 text-[10px] tracking-[0.22em] uppercase font-semibold mb-2" style={{ color: 'var(--nude-light)', fontFamily: "'Inter',sans-serif" }}>Signature</span>
              <p className="relative z-10 text-lg italic leading-tight text-center px-2" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--cream)' }}>
                Velvet<br />Reverie
              </p>
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
                <span className="block text-center text-[8px] tracking-[0.22em] uppercase" style={{ color: 'var(--nude)', fontFamily: "'Inter',sans-serif" }}>Signature Dress</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Bottom editorial caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.95 }}
          className="absolute bottom-5 left-0 right-0 z-20 text-center px-6"
        >
          <p className="text-2xl md:text-3xl mb-1" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--cream)' }}>
            2026 — Luxury Summer
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(250,247,244,0.72)', fontFamily: "'Inter',sans-serif" }}>
            Sun-drenched elegance — premium fabrics crafted for the modern Pakistani woman.
          </p>
        </motion.div>

        {/* Watch Film */}
        {films.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-[0.16em] uppercase font-medium transition-all hover:scale-105"
            style={{ background: 'rgba(245,237,230,0.18)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(230,183,169,0.4)', color: 'var(--cream)', fontFamily: "'Inter',sans-serif" }}
          >
            <Play size={12} className="fill-current" /> Watch Film
          </motion.button>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-1"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
            className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(230,183,169,0.8), transparent)' }}
          />
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(250,247,244,0.55)', fontFamily: "'Inter',sans-serif", writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Scroll
          </span>
        </motion.div>
      </section>

      {/* ══ TRUST STRIP ══════════════════════════════════ */}
      <section className="border-b" style={{ background: 'var(--beige)', borderColor: 'rgba(230,183,169,0.2)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ ['--tw-divide-opacity' as any]: '1', borderColor: 'rgba(230,183,169,0.22)' }}>
            {[
              { icon: '✦', label: 'Curated Collection',    sub: 'Every piece hand-selected' },
              { icon: '◈', label: '100% Premium Quality',  sub: 'Luxurious fabrics only'    },
              { icon: '◎', label: 'Nationwide Delivery',   sub: 'Shipped across Pakistan'   },
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

      {/* ══ PRODUCT CAROUSEL ═════════════════════════════ */}
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
              <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase font-medium transition-all hover:gap-3" style={{ color: 'var(--rose-gold)', fontFamily: "'Inter',sans-serif" }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <CoverflowCarousel products={products} />
          </div>
        </section>
      )}

      {/* ══ SEO TEXT BLOCK ═══════════════════════════════ */}
      <section className="py-16 md:py-20 border-t border-b" style={{ background: 'var(--beige)', borderColor: 'rgba(230,183,169,0.18)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase mb-4" style={{ color: 'var(--rose-gold)', fontFamily: "'Inter',sans-serif" }}>
              Premium Women's Fashion in Pakistan
            </p>
            <h2 className="text-3xl md:text-4xl leading-tight mb-6" style={{ fontFamily: "'Playfair Display',serif", color: 'var(--brown)' }}>
              Buy Women's Dresses Online in Pakistan
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--brown-muted)', fontFamily: "'Inter',sans-serif" }}>
              ZAYBAASH is the official destination for premium women's fashion in Pakistan. Explore elegant one-piece dresses,
              tailored two-piece suits, and signature handcrafted styles designed for the modern Pakistani woman.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--brown-muted)', fontFamily: "'Inter',sans-serif" }}>
              Shop with confidence — nationwide delivery, reliable support, and carefully curated seasonal collections. Luxury craftsmanship, everyday elegance.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { href: '/dresses',         label: "Shop Women's Dresses"     },
              { href: '/shop',            label: 'Browse Full Collection'    },
              { href: '/signature-dress', label: 'Explore Signature Dress'  },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="btn-luxury btn-outline w-full text-center">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ARTICLE CAROUSEL ═════════════════════════════ */}
      <ArticleCarousel articles={articles} />

      {/* ══ VIDEO MODAL ══════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && films.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col shadow-2xl"
              style={{ background: 'var(--brown)' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
              <div className="relative w-full aspect-video bg-black">
                <video key={films[activeFilm]?.videoUrl} src={films[activeFilm]?.videoUrl} controls autoPlay className="w-full h-full object-contain" />
              </div>
              <div className="p-4 border-t" style={{ borderColor: 'rgba(230,183,169,0.2)' }}>
                <h3 className="text-white text-lg mb-3 font-playfair" style={{ fontFamily: "'Playfair Display',serif" }}>{films[activeFilm]?.title}</h3>
                {films.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {films.map((f, i) => (
                      <button key={f._id} onClick={() => setActiveFilm(i)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${i === activeFilm ? 'bg-rose-gold text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                        style={{ fontFamily: "'Inter',sans-serif" }}
                      >
                        {f.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
