'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AppShell from '@/components/layout/AppShell';
import { motion } from 'framer-motion';
import type { StoreProduct } from '@/types/storefront';

export default function SizeGuidePage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: { products?: StoreProduct[] }) => {
        const withCharts = (data.products ?? []).filter(
          (p) => p.sizeChartImageUrl && p.sizeChartImageUrl.trim()
        );
        setProducts(withCharts);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Scroll to specific product chart if ?product= is set
  useEffect(() => {
    if (!productId || loading) return;
    const el = document.getElementById(`chart-${productId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [productId, loading]);

  return (
    <AppShell>
      <div className="pt-32 pb-24 bg-cream min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-playfair text-brown mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Size <span className="italic" style={{ color: '#E6B7A9' }}>Guide</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-brown-muted font-inter max-w-2xl mx-auto"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Find your perfect ZAYBAASH fit. Each size chart is crafted specifically for that garment.
            </motion.p>
          </div>

          {loading && (
            <div className="text-center py-20 text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
              Loading size charts...
            </div>
          )}

          {/* Fallback generic table if no products have charts uploaded */}
          {!loading && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="glass rounded-xl overflow-hidden border border-nude/20 bg-white/50 backdrop-blur-sm shadow-xl shadow-brown/5"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-brown text-cream text-xs uppercase tracking-[0.15em] font-inter">
                      <th className="py-5 px-6 font-semibold">Size</th>
                      <th className="py-5 px-6 font-semibold">PK Size</th>
                      <th className="py-5 px-6 font-semibold">Shoulder (in)</th>
                      <th className="py-5 px-6 font-semibold">Chest (in)</th>
                      <th className="py-5 px-6 font-semibold">Waist (in)</th>
                      <th className="py-5 px-6 font-semibold">Hips (in)</th>
                      <th className="py-5 px-6 font-semibold">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nude/20">
                    {[
                      { size: 'S',  pk: '10', shoulders: '14.0', chest: '19.5', waist: '18', hips: '20.5', length: '39' },
                      { size: 'M',  pk: '12', shoulders: '14.5', chest: '20.5', waist: '19.5', hips: '22.5', length: '40' },
                      { size: 'L',  pk: '14', shoulders: '15.5', chest: '22.0', waist: '21', hips: '24.5', length: '41' },
                    ].map((row) => (
                      <tr key={row.size} className="hover:bg-cream/40 transition-colors duration-200">
                        <td className="py-5 px-6 text-brown font-playfair font-semibold text-lg">{row.size}</td>
                        <td className="py-5 px-6 text-brown-muted font-inter text-sm">{row.pk}</td>
                        <td className="py-5 px-6 text-brown/80 font-inter text-sm">{row.shoulders}&quot;</td>
                        <td className="py-5 px-6 text-brown/80 font-inter text-sm">{row.chest}&quot;</td>
                        <td className="py-5 px-6 text-brown/80 font-inter text-sm">{row.waist}&quot;</td>
                        <td className="py-5 px-6 text-brown/80 font-inter text-sm">{row.hips}&quot;</td>
                        <td className="py-5 px-6 text-brown/80 font-inter text-sm">{row.length}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Dynamic product size charts */}
          {!loading && products.length > 0 && (
            <div className="flex flex-col gap-12">
              {products.map((p, i) => {
                const isHighlighted = p.productId === productId;
                return (
                  <motion.div
                    id={`chart-${p.productId}`}
                    key={p.productId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className={`rounded-xl overflow-hidden border bg-white/60 backdrop-blur-sm shadow-lg transition-all ${
                      isHighlighted ? 'border-brown ring-2 ring-brown/20' : 'border-nude/20'
                    }`}
                  >
                    <div className="px-6 py-4 border-b border-nude/20 flex items-center gap-3">
                      <h2
                        className="text-xl font-playfair text-brown"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {p.name}
                      </h2>
                      {isHighlighted && (
                        <span
                          className="text-xs font-inter font-semibold px-3 py-1 rounded-full bg-brown text-cream"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Current Product
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-white">
                      <Image
                        src={p.sizeChartImageUrl!}
                        alt={`${p.name} size chart`}
                        width={1200}
                        height={1200}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Measuring tips */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="border border-nude/20 p-6 rounded-xl bg-white/40 hover:bg-white/60 transition-colors duration-300">
              <h3 className="font-playfair text-xl text-brown mb-3">Chest</h3>
              <p className="text-sm font-inter text-brown-muted">Measure under your arms, around the fullest part of your chest with the tape completely level.</p>
            </div>
            <div className="border border-nude/20 p-6 rounded-xl bg-white/40 hover:bg-white/60 transition-colors duration-300">
              <h3 className="font-playfair text-xl text-brown mb-3">Waist</h3>
              <p className="text-sm font-inter text-brown-muted">Measure around your natural waistline (the narrowest part), keeping the tape comfortably loose.</p>
            </div>
            <div className="border border-nude/20 p-6 rounded-xl bg-white/40 hover:bg-white/60 transition-colors duration-300">
              <h3 className="font-playfair text-xl text-brown mb-3">Hips</h3>
              <p className="text-sm font-inter text-brown-muted">Measure around the fullest part of your hips with your feet planted together evenly.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
