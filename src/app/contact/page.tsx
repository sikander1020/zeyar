'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import AppShell from '@/components/layout/AppShell';
import ContactForm from '@/components/forms/ContactForm';

const ShaderGradientCanvas = dynamic(() => import('@/components/3d/ShaderGradient'), {
  ssr: false,
  loading: () => null,
});

function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="6" ry="6"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function IconTikTok({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 7.337a5.5 5.5 0 0 1-3.29-1.075A5.5 5.5 0 0 1 15.5 2H12v13.5a2.5 2.5 0 1 1-3.5-2.291V9.638A6.5 6.5 0 0 0 5.5 16a6.5 6.5 0 0 0 6.5 6.5A6.5 6.5 0 0 0 18.5 16V9.101A9.46 9.46 0 0 0 21 9.5V7.337z"/>
    </svg>
  );
}

function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: { name: string; email: string; subject: string; message: string }) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSent(true);
      // Reset form after 3 seconds
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream relative overflow-hidden">
        {/* Animated Shader Gradient Background */}
        <div className="absolute inset-0 opacity-45">
          <ShaderGradientCanvas 
            className="w-full h-full"
            color1="#FAF7F4"
            color2="#F0C9BF"
            color3="#B76E79"
            intensity={0.5}
          />
        </div>

        {/* Header */}
        <div className="bg-beige py-12 sm:py-16 text-center mb-0 px-4 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.3em] uppercase text-rose-gold font-inter block mb-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Get in Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-playfair text-brown leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact <span className="italic gradient-rose-text">Us</span>
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="divider-rose"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-brown-muted font-inter mt-4 max-w-sm mx-auto px-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            We&apos;d love to hear from you. Our team responds within 24 hours.
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 sm:gap-16">
            {/* Info */}
            <div className="lg:col-span-2 space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-playfair text-brown mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Reach Out
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Mail, label: 'Email', value: 'care.zaybaash@gmail.com' },
                    { icon: Phone, label: 'Phone', value: '+92 321 964 3246' },
                    { icon: MapPin, label: 'Address', value: 'Islamabad, Pakistan' },
                  ].map(({ icon: Icon, label, value }, idx) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-10 h-10 bg-nude/20 flex items-center justify-center flex-shrink-0 rounded-lg hover:bg-rose-gold/10 transition-colors">
                        <Icon size={16} className="text-rose-gold" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.15em] uppercase text-brown-muted font-inter mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
                        <p className="text-sm text-brown font-inter break-words" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Social */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xs tracking-[0.2em] uppercase text-brown-muted font-inter mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Follow ZAYBAASH
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: IconInstagram, href: 'https://www.instagram.com/zaybaash/', label: 'Instagram' },
                    { icon: IconTikTok,    href: 'https://www.tiktok.com/@zaybaash/',   label: 'TikTok'    },
                    { icon: IconFacebook,  href: 'https://facebook.com/zaybaash',  label: 'Facebook'  },
                  ].map(({ icon: Icon, href, label }, idx) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                      className="w-10 h-10 border border-nude flex items-center justify-center text-brown hover:bg-nude hover:text-white hover:border-nude transition-all duration-300 rounded"
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Map placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="aspect-video bg-beige border border-nude/20 flex items-center justify-center relative overflow-hidden rounded-xl hover:border-nude/40 transition-colors"
              >
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(230,183,169,0.15) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(230,183,169,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px',
                  }}
                />
                <div className="text-center relative z-10">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <MapPin size={32} className="text-rose-gold mx-auto mb-3" strokeWidth={1.5} />
                  </motion.div>
                  <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Islamabad, Pakistan
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="glass rounded-2xl p-8 sm:p-10 backdrop-blur-md"
              >
                <ContactForm 
                  onSubmit={handleSubmit}
                  loading={loading}
                  error={error}
                  sent={sent}
                  setSent={setSent}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
