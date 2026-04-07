'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { testimonials } from '@/data/products';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

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

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);

  const prev = () => setActive(a => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive(a => (a === testimonials.length - 1 ? 0 : a + 1));

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

            <p className="text-xl md:text-2xl font-cormorant text-cream/90 italic leading-relaxed mb-10 max-w-2xl mx-auto"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              &ldquo;{testimonials[active].text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-nude/40">
                <Image
                  src={testimonials[active].avatar}
                  alt={testimonials[active].name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <StarRating rating={testimonials[active].rating} />
                <p className="text-nude font-playfair text-lg mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {testimonials[active].name}
                </p>
                <p className="text-cream/40 text-sm font-inter mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {testimonials[active].title} · Purchased {testimonials[active].product}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button onClick={prev} className="p-3 border border-nude/20 text-nude hover:border-nude hover:bg-nude/10 transition-all duration-300 rounded-full">
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-300 rounded-full ${i === active ? 'w-8 h-2 bg-nude' : 'w-2 h-2 bg-nude/30 hover:bg-nude/60'}`}
              />
            ))}
          </div>
          <button onClick={next} className="p-3 border border-nude/20 text-nude hover:border-nude hover:bg-nude/10 transition-all duration-300 rounded-full">
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
