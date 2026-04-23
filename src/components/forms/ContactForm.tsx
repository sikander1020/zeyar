'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; subject: string; message: string }) => Promise<void>;
  loading?: boolean;
  error?: string;
  sent?: boolean;
  setSent?: (sent: boolean) => void;
}

const inputVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function ContactForm({ onSubmit, loading = false, error = '', sent = false, setSent }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(form);
    }
  };

  return (
    <>
      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-20 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <CheckCircle size={64} className="text-rose-gold" strokeWidth={1} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-playfair text-brown mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Message Sent Successfully
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-brown-muted font-inter mb-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Thank you for reaching out. We&apos;ll respond within 24 hours.
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => {
              if (setSent) setSent(false);
              setForm({ name: '', email: '', subject: '', message: '' });
            }}
            className="btn-luxury btn-outline text-sm"
          >
            Send Another Message
          </motion.button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-playfair text-brown mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Send a Message
          </motion.h2>

          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              variants={inputVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <label
                className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Full Name *
              </label>
              <input
                value={form.name}
                onChange={e => update('name', e.target.value)}
                required
                className="input-luxury w-full focus:ring-2 focus:ring-rose-gold/30 transition-all"
                placeholder="Your name"
                disabled={loading}
              />
            </motion.div>

            <motion.div
              variants={inputVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              <label
                className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Email Address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
                className="input-luxury w-full focus:ring-2 focus:ring-rose-gold/30 transition-all"
                placeholder="your@email.com"
                disabled={loading}
              />
            </motion.div>
          </div>

          {/* Subject */}
          <motion.div
            variants={inputVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <label
              className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-3"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Subject *
            </label>
            <input
              value={form.subject}
              onChange={e => update('subject', e.target.value)}
              required
              className="input-luxury w-full focus:ring-2 focus:ring-rose-gold/30 transition-all"
              placeholder="How can we help you?"
              disabled={loading}
            />
          </motion.div>

          {/* Message */}
          <motion.div
            variants={inputVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            <label
              className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-3"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Message *
            </label>
            <textarea
              value={form.message}
              onChange={e => update('message', e.target.value)}
              required
              rows={7}
              className="input-luxury w-full resize-none focus:ring-2 focus:ring-rose-gold/30 transition-all"
              placeholder="Tell us about your inquiry or feedback..."
              disabled={loading}
            />
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 text-sm font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                {error}
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            variants={inputVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
          >
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={!loading ? { scale: 0.98 } : undefined}
              whileHover={!loading ? { scale: 1.02 } : undefined}
              className="btn-luxury btn-primary w-full disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-xs text-brown-muted font-inter text-center"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We typically respond within 24 hours. Thank you for your patience.
          </motion.p>
        </form>
      )}
    </>
  );
}
