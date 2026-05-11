'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

/* ─── Article Carousel Data ─────────────────────────────── */
const ARTICLES = [
  {
    id: 1,
    tag: 'Style Guide',
    title: 'How to Style a Two-Piece Suit for Every Occasion',
    excerpt:
      'From morning brunches to evening soirées, your ZAYBAASH two-piece suit is the most versatile investment you can make this season.',
    image: '/article-1.png',
    date: 'May 2026',
    readTime: '4 min read',
  },
  {
    id: 2,
    tag: 'Fabric & Craft',
    title: 'The Art of Fine Fabric: What Makes a Dress Truly Luxurious',
    excerpt:
      'We explore the world of premium textiles — from hand-woven silks to structured linens — and how ZAYBAASH selects only the finest for each piece.',
    image: '/article-2.png',
    date: 'April 2026',
    readTime: '6 min read',
  },
  {
    id: 3,
    tag: 'Accessory Edit',
    title: 'The Complete Accessory Edit for the Modern Pakistani Woman',
    excerpt:
      'Curated styling notes on pairing jewelry, bags, and dupattas with your ZAYBAASH wardrobe for a signature look every time.',
    image: '/article-3.png',
    date: 'March 2026',
    readTime: '5 min read',
  },
];

/* ─── Shop Now Orb ────────────────────────────────────────── */
function ShopOrb() {
  return (
    <Link href="/shop" aria-label="Shop Now">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-24 h-24 cursor-pointer select-none"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(183,110,121,0.35))' }}
      >
        {/* Glass orb */}
        <div
          className="w-full h-full rounded-full flex flex-col items-center justify-center text-center"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85) 0%, rgba(245,237,230,0.7) 55%, rgba(230,183,169,0.5) 100%)',
            border: '1px solid rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 6px rgba(183,110,121,0.15), 0 8px 32px rgba(183,110,121,0.25)',
          }}
        >
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase leading-tight"
            style={{ color: 'var(--brown)', fontFamily: "'Inter', sans-serif" }}
          >
            SHOP
            <br />
            NOW
          </span>
        </div>
        {/* Spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: '1.5px dashed rgba(183,110,121,0.4)',
            inset: '-6px',
          }}
        />
      </motion.div>
    </Link>
  );
}

/* ─── Article fallback gradients by index ─────────────────── */
const ARTICLE_GRADIENTS = [
  'linear-gradient(135deg, #F5EDE6 0%, #E6B7A9 50%, #C58D7D 100%)',
  'linear-gradient(135deg, #EBD9CC 0%, #D4957F 50%, #B76E79 100%)',
  'linear-gradient(135deg, #FAF7F4 0%, #F0C9BF 45%, #D4957F 100%)',
];

function ArticleImage({ src, alt, gradient }: { src: string; alt: string; gradient: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-beige">
      {!err ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={() => setErr(true)}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: gradient }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brown/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

/* ─── Article Carousel ────────────────────────────────────── */
function ArticleCarousel() {
  const [active, setActive] = useState(0);
  const total = ARTICLES.length;

  const prev = () => setActive((p) => (p - 1 + total) % total);
  const next = () => setActive((p) => (p + 1) % total);

  return (
    <section className="bg-cream py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 gap-6">
          <div>
            <p
              className="text-xs tracking-[0.28em] uppercase mb-3"
              style={{ color: 'var(--rose-gold)', fontFamily: "'Inter', sans-serif" }}
            >
              From the Journal
            </p>
            <h2
              className="text-4xl md:text-5xl leading-[1.1]"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--brown)',
              }}
            >
              Style & Stories
            </h2>
          </div>
          {/* Navigation */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={prev}
              aria-label="Previous article"
              className="w-11 h-11 rounded-full border flex items-center justify-center transition-all hover:bg-brown hover:text-cream hover:border-brown"
              style={{
                borderColor: 'var(--nude)',
                color: 'var(--brown)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next article"
              className="w-11 h-11 rounded-full border flex items-center justify-center transition-all hover:bg-brown hover:text-cream hover:border-brown"
              style={{
                borderColor: 'var(--nude)',
                color: 'var(--brown)',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {ARTICLES.map((article, i) => {
                const isActive = i === active;
                const isNext = i === (active + 1) % total;
                const isPrev = i === (active - 1 + total) % total;
                if (!isActive && !isNext && !isPrev) return null;

                const idx = isActive ? 0 : isNext ? 1 : 2;

                return (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.09 }}
                    className="group cursor-pointer"
                    style={{
                      opacity: isActive ? 1 : 0.5,
                      transform: isActive ? 'scale(1)' : 'scale(0.97)',
                      transition: 'opacity 0.4s, transform 0.4s',
                    }}
                  >
                    {/* Image */}
                    <ArticleImage
                      src={article.image}
                      alt={article.title}
                      gradient={ARTICLE_GRADIENTS[i % ARTICLE_GRADIENTS.length]}
                    />

                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[10px] tracking-[0.18em] uppercase px-2 py-0.5"
                        style={{
                          background: 'var(--nude-light)',
                          color: 'var(--brown)',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {article.tag}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: 'var(--brown-muted)', fontFamily: "'Inter', sans-serif" }}
                      >
                        {article.date} · {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl leading-snug mb-3 group-hover:text-rose-gold transition-colors duration-300"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: 'var(--brown)',
                      }}
                    >
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: 'var(--brown-muted)', fontFamily: "'Inter', sans-serif" }}
                    >
                      {article.excerpt}
                    </p>

                    {/* Read link */}
                    <span
                      className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase font-medium group-hover:gap-3 transition-all duration-300"
                      style={{ color: 'var(--rose-gold)', fontFamily: "'Inter', sans-serif" }}
                    >
                      Read Article
                      <ArrowRight size={12} />
                    </span>
                  </motion.article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {ARTICLES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Article ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? '28px' : '8px',
                height: '8px',
                background: i === active ? 'var(--rose-gold)' : 'var(--nude)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main Hero ───────────────────────────────────────────── */
export default function HeroSection() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  const [films, setFilms] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilmIndex, setActiveFilmIndex] = useState(0);
  const [heroImgError, setHeroImgError] = useState(false);
  const [womenImgError, setWomenImgError] = useState(false);

  useEffect(() => {
    router.prefetch('/shop');
    router.prefetch('/dresses');
    fetch('/api/campaign-films')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setFilms(d); })
      .catch(() => {});
  }, [router]);

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '100svh', background: 'var(--beige)' }}
      >
        {/* ── Parallax BG image ── */}
        <motion.div
          style={{ y: imgY }}
          className="absolute inset-0 w-full h-[110%] -top-[5%]"
        >
          {!heroImgError ? (
            <Image
              src="/hero-model.png"
              alt="ZAYBAASH 2026 Collection"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              onError={() => setHeroImgError(true)}
            />
          ) : (
            /* Fallback gradient when image not yet available */
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(160deg, #F5EDE6 0%, #EBD9CC 25%, #E6B7A9 55%, #C58D7D 80%, #9B6B5A 100%)',
              }}
            />
          )}
          {/* Subtle warm overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(245,237,230,0.15) 0%, rgba(245,237,230,0.05) 40%, rgba(58,46,42,0.22) 100%)',
            }}
          />
        </motion.div>

        {/* ── Season badge ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-28 left-8 md:left-12"
        >
          <span
            className="text-[10px] tracking-[0.28em] uppercase px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(245,237,230,0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(230,183,169,0.5)',
              color: 'var(--brown)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            New Season 2026
          </span>
        </motion.div>

        {/* ── Big bold title — top left ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-6 md:left-12 z-10"
          style={{ top: 'clamp(100px, 18vh, 160px)' }}
        >
          <h1
            className="leading-[0.92] max-w-xs md:max-w-lg"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              color: 'var(--brown)',
              fontWeight: 700,
            }}
          >
            Summer
            <br />
            <span className="italic font-light">Collection</span>
          </h1>
        </motion.div>

        {/* ── Shop Now orb — top right ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-28 right-8 md:right-14 z-20"
        >
          <ShopOrb />
        </motion.div>

        {/* ── Collection cards — bottom corners ── */}
        {/* Women */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="absolute bottom-24 left-4 md:left-10 z-20 w-36 md:w-44"
        >
          <Link href="/dresses" className="group block">
            <div className="relative aspect-[3/4] overflow-hidden mb-2 shadow-lg">
              {!womenImgError ? (
                <Image
                  src="/collection-women.png"
                  alt="Women Collection"
                  fill
                  sizes="176px"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  onError={() => setWomenImgError(true)}
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(160deg, #F5EDE6 0%, #E6B7A9 60%, #B76E79 100%)',
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brown/50 to-transparent" />
              <span
                className="absolute bottom-2 left-0 right-0 text-center text-[8px] md:text-[9px] tracking-[0.22em] uppercase font-semibold"
                style={{ color: 'var(--cream)', fontFamily: "'Inter', sans-serif" }}
              >
                Women Collection
              </span>
            </div>
          </Link>
        </motion.div>

        {/* Watch Film card (if films exist, otherwise feature card) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="absolute bottom-24 right-4 md:right-10 z-20 w-36 md:w-44"
        >
          <Link href="/signature-dress" className="group block">
            <div
              className="relative aspect-[3/4] overflow-hidden mb-2 shadow-lg flex flex-col items-center justify-center text-center"
              style={{ background: 'var(--brown)' }}
            >
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(230,183,169,0.5) 0%, transparent 70%)',
                }}
              />
              <span
                className="relative z-10 text-[10px] tracking-[0.22em] uppercase font-semibold mb-2"
                style={{ color: 'var(--nude-light)', fontFamily: "'Inter', sans-serif" }}
              >
                Signature
              </span>
              <p
                className="relative z-10 text-lg italic leading-tight"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cream)' }}
              >
                Velvet
                <br />
                Reverie
              </p>
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
                <span
                  className="text-[8px] tracking-[0.22em] uppercase"
                  style={{ color: 'var(--nude)', fontFamily: "'Inter', sans-serif" }}
                >
                  Signature Dress
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Bottom editorial text ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center w-full max-w-xl px-6"
        >
          <p
            className="text-2xl md:text-3xl mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cream)' }}
          >
            2026 — Luxury Summer
          </p>
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: 'rgba(250,247,244,0.75)', fontFamily: "'Inter', sans-serif" }}
          >
            Inspired by sun-drenched days, our collection blends modern design
            <br className="hidden md:block" />
            with breezy, premium fabrics — created for grace and style in the heat.
          </p>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-4 right-8 flex flex-col items-center gap-1 z-20"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-nude to-transparent"
          />
          <span
            className="text-[9px] tracking-[0.2em] uppercase rotate-90 origin-right translate-x-4"
            style={{ color: 'rgba(250,247,244,0.6)', fontFamily: "'Inter', sans-serif" }}
          >
            Scroll
          </span>
        </motion.div>

        {/* Watch Film button if films exist */}
        {films.length > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-[0.16em] uppercase font-medium transition-all hover:scale-105"
            style={{
              background: 'rgba(245,237,230,0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(230,183,169,0.4)',
              color: 'var(--cream)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <Play size={12} className="fill-current" />
            Watch Film
          </motion.button>
        )}
      </section>

      {/* ── EDITORIAL STRIP ───────────────────────────────── */}
      <section
        className="py-14 md:py-20 border-b"
        style={{
          background: 'var(--beige)',
          borderColor: 'rgba(230,183,169,0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x"
          style={{ '--tw-divide-opacity': '1', borderColor: 'rgba(230,183,169,0.25)' } as any}
        >
          {[
            { icon: '✦', label: 'Curated Collection', sub: 'Each piece hand-selected' },
            { icon: '◈', label: '100% Premium Quality', sub: 'Luxurious fabrics only' },
            { icon: '◎', label: 'Nationwide Delivery', sub: 'Shipped across Pakistan' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex items-center gap-4 py-6 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0">
              <span className="text-2xl" style={{ color: 'var(--rose-gold)' }}>{icon}</span>
              <div>
                <p
                  className="text-sm font-semibold tracking-wide"
                  style={{ color: 'var(--brown)', fontFamily: "'Inter', sans-serif" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: 'var(--brown-muted)', fontFamily: "'Inter', sans-serif" }}
                >
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARTICLE CAROUSEL ─────────────────────────────── */}
      <ArticleCarousel />

      {/* ── Video Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && films.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{ background: 'var(--brown)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
              <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                <video
                  key={films[activeFilmIndex]?.videoUrl}
                  src={films[activeFilmIndex]?.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="bg-brown p-4 border-t" style={{ borderColor: 'rgba(230,183,169,0.2)' }}>
                <h3
                  className="text-white text-lg mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {films[activeFilmIndex]?.title}
                </h3>
                {films.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {films.map((film, i) => (
                      <button
                        key={film._id}
                        onClick={() => setActiveFilmIndex(i)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${
                          activeFilmIndex === i
                            ? 'bg-rose-gold text-white shadow-md'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {film.title}
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
