'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

type FormState = {
  name: string;
  email: string;
  message: string;
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.18 + index * 0.08, duration: 0.45 },
  }),
};

export default function ContactForm() {
  const reduceMotion = useReducedMotion();
  const titleText = "We'd Love to Hear from You";
  const [typedTitle, setTypedTitle] = useState('');

  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reduceMotion) {
      setTypedTitle(titleText);
      return;
    }

    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setTypedTitle(titleText.slice(0, i));
      if (i >= titleText.length) {
        window.clearInterval(timer);
      }
    }, 45);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: 'Website Contact Inquiry',
          message: form.message,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-[1.5rem] border border-[#6a4e54]/40 bg-gradient-to-br from-[#4c363c] via-[#3f2d33] to-[#34252a] p-5 sm:p-6 shadow-[0_30px_80px_-28px_rgba(45,27,32,0.6)]"
      animate={reduceMotion ? undefined : { y: [0, -4, 0], rotate: [0, 0.3, 0] }}
      transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-40 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={reduceMotion ? undefined : { x: ['0%', '520%'] }}
        transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          aria-hidden
          className="pointer-events-none absolute h-2 w-2 rounded-full bg-nude/50"
          style={{ top: `${20 + dot * 25}%`, right: `${8 + dot * 6}%` }}
          animate={reduceMotion ? undefined : { y: [0, -10, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2.8 + dot * 0.5, repeat: Infinity, ease: 'easeInOut', delay: dot * 0.3 }}
        />
      ))}

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-rose-gold/30 to-nude/10 blur-3xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], rotate: [0, 12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-[110px_1fr] sm:gap-6">
        <motion.div
          className="hidden items-end justify-center sm:flex"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative h-52 w-20"
            animate={reduceMotion ? undefined : { y: [0, -6, 0], rotate: [0, 1.5, -1.5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute left-1/2 top-0 h-9 w-9 -translate-x-1/2 rounded-full bg-[#f0c9bf]"
              animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute left-1/2 top-2.5 h-3.5 w-10 -translate-x-1/2 rounded-full bg-[#2a1f24]">
              <motion.span
                className="absolute left-[10px] top-[5px] h-[2px] w-[5px] rounded-full bg-[#f7d8cc]"
                animate={reduceMotion ? undefined : { scaleY: [1, 0.2, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.3 }}
              />
              <motion.span
                className="absolute right-[10px] top-[5px] h-[2px] w-[5px] rounded-full bg-[#f7d8cc]"
                animate={reduceMotion ? undefined : { scaleY: [1, 0.2, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.3 }}
              />
            </div>
            <motion.div
              className="absolute left-1/2 top-8 h-20 w-14 -translate-x-1/2 rounded-t-3xl rounded-b-xl bg-gradient-to-b from-[#9a5b67] to-[#6b3f48]"
              animate={reduceMotion ? undefined : { rotate: [-2, 2, -2], y: [0, 2, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute left-[20px] top-[111px] h-20 w-[10px] rounded-full bg-[#2f2529]"
              animate={reduceMotion ? undefined : { rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute left-[48px] top-[111px] h-20 w-[10px] rounded-full bg-[#2f2529]"
              animate={reduceMotion ? undefined : { rotate: [1.5, -1.5, 1.5] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            />

            {[0, 1, 2].map((idx) => (
              <motion.span
                key={idx}
                className="absolute left-[58px] top-[98px] h-2 w-2 rounded-full bg-[#f0c9bf]"
                animate={reduceMotion ? undefined : { x: [0, 12, 22], y: [0, -6, -10], opacity: [0.8, 0.45, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut', delay: idx * 0.2 }}
              />
            ))}

            <div className="absolute left-[14px] top-[186px] h-3 w-[24px] rounded-full bg-[#e7d7cf]" />
            <div className="absolute left-[44px] top-[186px] h-3 w-[24px] rounded-full bg-[#e7d7cf]" />
          </motion.div>
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4"
          >
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-nude-light">
              <Sparkles size={12} />
              Personal Assistance
            </div>
            <h3 className="text-2xl font-playfair text-cream" style={{ fontFamily: "'Playfair Display', serif" }}>
              {typedTitle}
              {!reduceMotion && typedTitle.length < titleText.length && (
                <motion.span
                  className="ml-1 inline-block h-6 w-[2px] bg-nude align-middle"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              )}
            </h3>
            <p className="mt-1 text-xs font-inter text-[#d7c6bf]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Share your inquiry and our team will get back to you quickly.
            </p>
          </motion.div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-[#8b6870]/70 bg-[#50383f]/60 p-6 text-center"
            >
              <CheckCircle2 className="mx-auto mb-3 text-nude" size={42} strokeWidth={1.6} />
              <p className="text-xl font-playfair text-cream" style={{ fontFamily: "'Playfair Display', serif" }}>
                Message Sent
              </p>
              <p className="mt-1 text-sm font-inter text-[#d9cbc4]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Thank you. We will respond within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 rounded-full border border-nude/50 px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-nude hover:bg-nude/10"
              >
                Send Another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <motion.div variants={fieldVariants} initial="hidden" animate="visible" custom={0}>
                <label className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-[#d4b6ae]">Full Name</label>
                <motion.input
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Your name"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          boxShadow: [
                            '0 0 0px rgba(245, 190, 176, 0.0)',
                            '0 0 10px rgba(245, 190, 176, 0.18)',
                            '0 0 0px rgba(245, 190, 176, 0.0)',
                          ],
                        }
                  }
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full rounded-xl border border-[#77585f] bg-[#60464d]/40 px-4 py-3 text-sm text-cream outline-none transition placeholder:text-[#b99795] focus:border-nude/70 focus:ring-2 focus:ring-nude/20"
                />
              </motion.div>

              <motion.div variants={fieldVariants} initial="hidden" animate="visible" custom={1}>
                <label className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-[#d4b6ae]">Email</label>
                <motion.input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="you@email.com"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          boxShadow: [
                            '0 0 0px rgba(245, 190, 176, 0.0)',
                            '0 0 10px rgba(245, 190, 176, 0.16)',
                            '0 0 0px rgba(245, 190, 176, 0.0)',
                          ],
                        }
                  }
                  transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                  className="w-full rounded-xl border border-[#77585f] bg-[#60464d]/40 px-4 py-3 text-sm text-cream outline-none transition placeholder:text-[#b99795] focus:border-nude/70 focus:ring-2 focus:ring-nude/20"
                />
              </motion.div>

              <motion.div variants={fieldVariants} initial="hidden" animate="visible" custom={2}>
                <label className="mb-1 block text-[11px] uppercase tracking-[0.16em] text-[#d4b6ae]">Message</label>
                <motion.textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  required
                  rows={5}
                  disabled={loading}
                  placeholder="Tell us how we can help..."
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          boxShadow: [
                            '0 0 0px rgba(245, 190, 176, 0.0)',
                            '0 0 12px rgba(245, 190, 176, 0.2)',
                            '0 0 0px rgba(245, 190, 176, 0.0)',
                          ],
                        }
                  }
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                  className="w-full resize-none rounded-xl border border-[#77585f] bg-[#60464d]/40 px-4 py-3 text-sm text-cream outline-none transition placeholder:text-[#b99795] focus:border-nude/70 focus:ring-2 focus:ring-nude/20"
                />
              </motion.div>

              {error && <p className="text-sm text-[#ffc7bf]">{error}</p>}

              <motion.button
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                type="submit"
                disabled={loading}
                whileTap={!loading ? { scale: 0.98 } : undefined}
                whileHover={!loading ? { scale: 1.02, y: -2 } : undefined}
                animate={reduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                className="mt-1 w-full rounded-xl bg-gradient-to-r from-[#bf746d] to-[#c98a7e] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#2d1f22] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundSize: '200% 200%' }}
              >
                {loading ? 'Sending...' : 'Submit'}
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
