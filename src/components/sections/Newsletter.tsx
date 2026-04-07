'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send } from 'lucide-react';

export default function Newsletter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-24 bg-beige relative overflow-hidden" ref={ref}>
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-nude/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-rose-gold/10 blur-3xl" />

      <div className="max-w-3xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-semibold font-inter block mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Inner Circle
          </span>
          <h2 className="text-5xl font-playfair text-brown mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Join the{' '}
            <span className="italic gradient-rose-text">ZEYAR Circle</span>
          </h2>
          <div className="divider-rose" />
          <p className="text-brown-muted font-inter max-w-md mx-auto my-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            Be the first to know about exclusive drops, private sales, and behind-the-scenes stories from the house of ZEYAR.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-xl px-10 py-8"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-playfair text-brown mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Welcome to the Circle
              </h3>
              <p className="text-brown-muted text-sm font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                Thank you! You&apos;ll receive exclusive updates at {email}.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto shadow-lg shadow-nude/20">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="input-luxury flex-1"
              />
              <button
                type="submit"
                className="btn-luxury btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                Subscribe
                <Send size={13} strokeWidth={2} />
              </button>
            </form>
          )}

          <p className="text-xs text-brown-muted mt-4 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
            No spam, ever. Unsubscribe anytime. Privacy respected.
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-10 mt-14 pt-10 border-t border-nude/30"
        >
          {[
            { emoji: '🔒', label: 'Secure Checkout' },
            { emoji: '✈️', label: 'Free Shipping' },
            { emoji: '↩️', label: 'Easy Returns' },
          ].map(({ emoji, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="text-xl">{emoji}</span>
              <span className="text-xs tracking-[0.1em] uppercase text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
