'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';

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
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        {/* Header */}
        <div className="bg-beige py-16 text-center mb-0">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Get in Touch
          </span>
          <h1 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
            Contact <span className="italic gradient-rose-text">Us</span>
          </h1>
          <div className="divider-rose" />
          <p className="text-brown-muted font-inter mt-4 max-w-sm mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            We&apos;d love to hear from you. Our team responds within 24 hours.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Info */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-playfair text-brown mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Reach Out
                </h2>
                <div className="space-y-6">
                  {[
                    { icon: Mail, label: 'Email', value: 'care.zaybaash@gmail.com' },
                    { icon: Phone, label: 'Phone', value: '+92 321 964 3246' },
                    { icon: MapPin, label: 'Address', value: 'Islamabad, Pakistan' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex gap-4">
                      <div className="w-10 h-10 bg-nude/20 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-rose-gold" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.15em] uppercase text-brown-muted font-inter mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</p>
                        <p className="text-sm text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-brown-muted font-inter mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Follow ZAYBAASH
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: IconInstagram, href: 'https://www.instagram.com/zaybaash/', label: 'Instagram' },
                    { icon: IconTikTok,    href: 'https://www.tiktok.com/@zaybaash/',   label: 'TikTok'    },
                    { icon: IconFacebook,  href: 'https://facebook.com/zaybaash',  label: 'Facebook'  },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 border border-nude flex items-center justify-center text-brown hover:bg-nude hover:text-white hover:border-nude transition-all duration-300"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="aspect-video bg-beige border border-nude/20 flex items-center justify-center relative overflow-hidden">
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
                  <MapPin size={32} className="text-rose-gold mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Fashion District, Karachi
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-5xl mb-6">💌</div>
                  <h2 className="text-3xl font-playfair text-brown mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Message Sent
                  </h2>
                  <p className="text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Thank you for reaching out. We&apos;ll be in touch within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-playfair text-brown mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Send a Message
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Name</label>
                      <input value={form.name} onChange={e => update('name', e.target.value)} required className="input-luxury" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Email</label>
                      <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required className="input-luxury" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Subject</label>
                    <input value={form.subject} onChange={e => update('subject', e.target.value)} required className="input-luxury" placeholder="How can we help you?" />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      required
                      rows={8}
                      className="input-luxury resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="btn-luxury btn-primary w-full"
                  >
                    Send Message
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
