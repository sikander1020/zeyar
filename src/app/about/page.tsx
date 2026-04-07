'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const values = [
  {
    icon: '✦',
    title: 'Uncompromising Quality',
    description: 'Every ZEYAR piece is crafted from the finest globally-sourced fabrics — Italian silk, French lace, and premium cashmeres.'
  },
  {
    icon: '♡',
    title: 'Made for Real Women',
    description: 'We design for bodies, lives, and moments — not just runways. Each silhouette is tested across all sizes for the perfect fit.'
  },
  {
    icon: '✿',
    title: 'Conscious Luxury',
    description: 'Sustainability is part of our DNA. We commit to ethical production, minimal waste, and longevity over fast fashion.'
  },
];

export default function AboutPage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <AppShell>
      <div className="pt-20 bg-cream">
        {/* Hero */}
        <div className="relative min-h-[70vh] bg-brown flex items-center overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(230,183,169,0.8) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(183,110,121,0.5) 0%, transparent 50%)',
            }}
          />
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xs tracking-[0.3em] uppercase text-nude/60 font-inter block mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Our Story
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-6xl lg:text-7xl font-playfair text-nude leading-tight mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Born from{' '}
                <span className="italic" style={{ color: '#E6B7A9' }}>love</span>
                <br/>of elegance
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-cream/60 font-inter leading-relaxed text-lg max-w-lg"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ZEYAR was founded with a singular vision: to create fashion that makes every woman feel like the 
                heroine of her own story. Softer than a whisper, stronger than silk.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative w-full aspect-[4/5] max-w-md ml-auto overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80"
                  alt="ZEYAR Brand Story"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto px-6 py-24 text-center" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-playfair text-brown mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Where Every Stitch Tells a Story
            </h2>
            <div className="divider-rose" />
            <div className="space-y-6 mt-8 text-brown-muted font-inter leading-relaxed text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
              <p>
                ZEYAR began in 2026 as a small atelier in the heart of Islamabad. Built collaboratively by three partners with a shared passion for design, the brand was born from a singular dream: to bring world-class, premium luxury to women who deserved to feel extraordinary every day.
              </p>
              <p>
                The name ZEYAR — meaning &quot;brightness&quot; in its root tongue — was chosen intentionally. Every piece we create is designed to illuminate the woman who wears it, to highlight her individuality, her power, her grace.
              </p>
              <p>
                Today, ZEYAR dresses women across the globe. From the CEO commanding a boardroom in our tailored power suits, to the elegant woman shimmering in our premium two-piece sets, to the mother who simply wants to feel beautiful at school pickup — we design for all of them.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="bg-beige py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
                What We <span className="italic gradient-rose-text">Stand For</span>
              </h2>
              <div className="divider-rose" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((val, i) => (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="text-center p-8"
                >
                  <div className="text-4xl text-nude mb-6">{val.icon}</div>
                  <h3 className="text-xl font-playfair text-brown mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {val.title}
                  </h3>
                  <p className="text-brown-muted font-inter text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {val.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-24 text-center px-6">
          <h2 className="text-4xl font-playfair text-brown mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Find Your <span className="italic gradient-rose-text">Piece?</span>
          </h2>
          <Link href="/shop" className="btn-luxury btn-primary inline-flex items-center gap-3">
            Shop the Collection <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
