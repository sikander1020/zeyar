'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { BadgeCheck, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

type ReviewCard = {
  reviewId: string;
  customerName: string;
  productName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
  createdAt?: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`text-sm ${i <= rating ? 'text-rose-gold' : 'text-nude/30'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function getInitials(name?: string) {
  if (!name) return 'C';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2) || 'C';
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        setLoading(true);
        const res = await fetch('/api/reviews', { cache: 'no-store', signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load reviews: ${res.status}`);
        const data = await res.json() as { reviews?: ReviewCard[] };
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Failed to load reviews:', error);
          setReviews([]);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadReviews();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (active >= reviews.length) {
      setActive(0);
    }
  }, [active, reviews.length]);

  const activeReview = useMemo(() => reviews[active], [active, reviews]);
  const prev = () => setActive((current) => (current === 0 ? reviews.length - 1 : current - 1));
  const next = () => setActive((current) => (current === reviews.length - 1 ? 0 : current + 1));

  if (loading) {
    return (
      <section className="section-padding bg-brown overflow-hidden relative" ref={ref}>
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <span className="text-xs tracking-[0.3em] uppercase text-nude/60 font-semibold font-inter block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Client Love
          </span>
          <h2 className="text-5xl font-playfair text-nude" style={{ fontFamily: "'Playfair Display', serif" }}>
            Words that <span className="italic" style={{ color: '#E6B7A9' }}>inspire</span>
          </h2>
          <p className="mt-8 text-base md:text-lg text-cream/70 max-w-2xl mx-auto leading-relaxed font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            Loading approved customer reviews...
          </p>
        </div>
      </section>
    );
  }

  if (!loading && reviews.length === 0) {
    return (
      <section className="section-padding bg-brown overflow-hidden relative" ref={ref}>
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <span className="text-xs tracking-[0.3em] uppercase text-nude/60 font-semibold font-inter block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Client Love
          </span>
          <h2 className="text-5xl font-playfair text-nude" style={{ fontFamily: "'Playfair Display', serif" }}>
            Words that <span className="italic" style={{ color: '#E6B7A9' }}>inspire</span>
          </h2>
          <p className="mt-8 text-base md:text-lg text-cream/70 max-w-2xl mx-auto leading-relaxed font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            Approved customer reviews will appear here after they are submitted and published.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-brown overflow-hidden relative" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(230,183,169,1) 40px, rgba(230,183,169,1) 41px),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(230,183,169,1) 40px, rgba(230,183,169,1) 41px)`,
        }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-nude/60 font-semibold font-inter block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Client Love
          </span>
          <h2 className="text-5xl font-playfair text-nude" style={{ fontFamily: "'Playfair Display', serif" }}>
            Words that{' '}
            <span className="italic" style={{ color: '#E6B7A9' }}>inspire</span>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Quote Icon */}
            <Quote
              size={48}
              className="text-nude/20 mx-auto mb-6"
              strokeWidth={1}
            />

            <div className="mx-auto mb-8 flex max-w-3xl flex-col gap-6 rounded-[28px] border border-nude/15 bg-[#2d1f1b]/80 p-6 md:p-8 text-left shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-3">
                {activeReview?.isVerifiedPurchase ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-rose-gold/40 bg-rose-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-gold">
                    <BadgeCheck size={14} /> Verified purchase
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-nude/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-nude/70">
                    Published review
                  </span>
                )}
                <span className="text-[11px] uppercase tracking-[0.16em] text-nude/50">
                  {activeReview?.productName}
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-[180px,1fr] md:items-start">
                <div className="overflow-hidden rounded-[24px] border border-nude/15 bg-black/10">
                  {activeReview?.images?.[0] ? (
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={activeReview.images[0]}
                        alt={`${activeReview.customerName} review photo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/5] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(230,183,169,0.18),_rgba(255,255,255,0.02))] text-4xl font-semibold text-nude">
                      {getInitials(activeReview?.customerName)}
                    </div>
                  )}
                </div>

                <div className="flex h-full flex-col justify-between">
                  <div>
                    <p
                      className="text-xl md:text-2xl font-cormorant text-cream/90 italic leading-relaxed"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      &ldquo;{activeReview?.comment}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-t border-nude/15 pt-5 md:flex-row md:items-end md:justify-between">
                    <div>
                      <StarRating rating={activeReview?.rating ?? 5} />
                      <p className="text-nude font-playfair text-lg mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {activeReview?.customerName}
                      </p>
                      <p className="text-cream/40 text-sm font-inter mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {activeReview?.title || 'Customer Review'}
                      </p>
                    </div>
                    <p className="text-xs tracking-[0.14em] uppercase text-nude/45">
                      Genuine customer feedback from our approved review feed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-xs tracking-[0.18em] uppercase text-nude/45">
                {activeReview?.customerName}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button onClick={prev} disabled={reviews.length < 2} className="p-3 border border-nude/20 text-nude hover:border-nude hover:bg-nude/10 transition-all duration-300 rounded-full disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-300 rounded-full ${i === active ? 'w-8 h-2 bg-nude' : 'w-2 h-2 bg-nude/30 hover:bg-nude/60'}`}
              />
            ))}
          </div>
          <button onClick={next} disabled={reviews.length < 2} className="p-3 border border-nude/20 text-nude hover:border-nude hover:bg-nude/10 transition-all duration-300 rounded-full disabled:opacity-40 disabled:cursor-not-allowed">
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
