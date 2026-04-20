'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full border border-nude/30 animate-pulse" />
    </div>
  ),
});

export default function HeroSection() {
  const router = useRouter();
  const stagger = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    router.prefetch('/shop');
    router.prefetch('/dresses');
  }, [router]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cream via-beige to-cream-dark">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, rgba(230,183,169,0.4) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(183,110,121,0.2) 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center w-full pt-12 sm:pt-16 lg:pt-24 pb-8 sm:pb-12">
          {/* Left: Text content */}
          <div className="order-2 lg:order-1">
            {/* Tag */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-8"
            >
              <motion.span variants={item} className="w-10 h-px bg-rose-gold" />
              <motion.span
                variants={item}
                className="text-xs tracking-[0.25em] uppercase text-rose-gold font-semibold font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                New Season 2026
              </motion.span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.28 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair leading-[1.08] sm:leading-[1.05] text-brown mb-4 sm:mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Elegance{' '}
              <span className="italic">is</span>
              <br />
              <span className="gradient-rose-text">a choice</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="text-sm sm:text-base text-brown-muted font-inter leading-relaxed mb-6 sm:mb-10 max-w-md"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Discover the new ZAYBAASH collection — where every piece tells a story of feminine grace, 
              luxurious craftsmanship, and timeless sophistication.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.58 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                prefetch
                onMouseEnter={() => router.prefetch('/shop')}
                onFocus={() => router.prefetch('/shop')}
                className="btn-luxury btn-primary inline-flex items-center gap-3"
              >
                Explore Collection
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <button className="btn-luxury btn-outline inline-flex items-center gap-3">
                <Play size={14} strokeWidth={2} className="fill-current" />
                Watch Film
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex gap-4 sm:gap-8 lg:gap-10 mt-8 sm:mt-14 pt-6 sm:pt-10 border-t border-nude/30"
            >
              {[
                { value: 'Curated', label: 'Exclusive Designs' },
                { value: '100%', label: 'Premium Quality' },
                { value: '24/7', label: 'Client Support' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p
                    className="text-lg sm:text-2xl font-playfair font-semibold text-brown"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-[10px] sm:text-xs tracking-[0.12em] uppercase text-brown-muted font-inter mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Hero scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glow ring behind scene */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nude/40 to-rose-gold/20 blur-3xl scale-90" />
              <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/60 shadow-[0_36px_90px_-40px_rgba(74,46,38,0.5)]">
                <HeroScene />
              </div>
            </div>

            {/* Floating card — New Arrival */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1 }}
              className="absolute top-8 -right-4 glass rounded-xl px-5 py-4 hidden lg:block"
            >
              <span className="badge-new block mb-2">NEW</span>
              <p className="text-sm font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                Velvet Reverie
              </p>
              <p className="text-xs text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Rs 80,920
              </p>
            </motion.div>

            {/* Floating card — Rating */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="absolute bottom-16 -left-4 glass rounded-xl px-5 py-4 hidden lg:block"
            >
              <div className="flex items-center gap-2 mb-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-rose-gold text-sm">★</span>
                ))}
              </div>
              <p className="text-xs text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                &quot;A stunning debut collection!&quot;
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-nude to-transparent"
        />
        <span className="text-[10px] tracking-[0.2em] uppercase text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
