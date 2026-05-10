'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { motion } from 'framer-motion';
import type { StoreProduct } from '@/types/storefront';

const MEASURE_TIPS: Record<string, string> = {
  chest: 'Measure under your arms, around the fullest part of your chest with the tape completely level.',
  bust: 'Measure around the fullest part of your bust, keeping the tape level and parallel to the floor.',
  waist: 'Measure around your natural waistline (the narrowest part), keeping the tape comfortably loose.',
  hips: 'Measure around the fullest part of your hips with your feet planted together evenly.',
  length: 'Measure from the top of the shoulder straight down to the desired hemline.',
  shoulder: 'Measure from the edge of one shoulder seam to the other across the back.',
  shoulders: 'Measure from the edge of one shoulder seam to the other across the back.',
  sleeve: 'Measure from the shoulder seam down to the wrist with your arm slightly bent.',
};

function getMeasureTips(rows: StoreProduct['sizeChartRows']) {
  if (!rows || rows.length === 0) return Object.entries(MEASURE_TIPS).slice(0, 4);
  const sample = rows[0];
  return Object.keys(sample)
    .filter((k) => k !== 'size')
    .map((k) => [k, MEASURE_TIPS[k.toLowerCase()] ?? `Measure your ${k.toLowerCase()} as indicated on the chart.`]);
}

function SizeGuideContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: { products?: StoreProduct[] }) => {
        const withCharts = (data.products ?? []).filter(
          (p) => (p.sizeChartImageUrl && p.sizeChartImageUrl.trim()) || (p.sizeChartRows && p.sizeChartRows.length > 0)
        );
        setProducts(withCharts);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!productId || loading) return;
    setTimeout(() => {
      const el = document.getElementById(`chart-${productId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [productId, loading]);

  const highlightedProduct = products.find((p) => p.productId === productId);
  const displayProducts = highlightedProduct
    ? [highlightedProduct, ...products.filter((p) => p.productId !== productId)]
    : products;

  return (
    <div className="pt-32 pb-24 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.3em] uppercase font-semibold font-inter block mb-4"
            style={{ color: '#B76E79', fontFamily: "'Inter', sans-serif" }}
          >
            Find Your Fit
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-playfair text-brown mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Size <span className="italic" style={{ color: '#E6B7A9' }}>Guide</span>
          </motion.h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-gold to-transparent mx-auto mb-6" style={{ background: 'linear-gradient(to right, transparent, #B76E79, transparent)' }} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-brown-muted font-inter max-w-xl mx-auto text-sm leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Each garment is measured and charted individually for the most accurate fit. All measurements are in inches.
          </motion.p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-nude border-t-brown rounded-full animate-spin mb-4" />
            <p className="text-brown-muted font-inter text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Loading size charts...</p>
          </div>
        )}

        {/* No charts yet — fallback generic table */}
        {!loading && products.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
            <div className="rounded-2xl overflow-hidden border border-nude/30 shadow-xl shadow-brown/5 bg-white">
              <div className="px-6 py-4 border-b border-nude/20" style={{ background: 'linear-gradient(to right, #3A2E2A, #6B5247)' }}>
                <h2 className="text-white font-playfair text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Standard ZAYBAASH Sizing</h2>
                <p className="text-white/60 text-xs font-inter mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>All measurements in inches</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr style={{ background: '#F5EDE6' }}>
                      {['Size', 'PK', 'Shoulder', 'Chest', 'Waist', 'Hips', 'Length'].map((h) => (
                        <th key={h} className="py-3 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'S',  pk: '10', shoulders: '14.0', chest: '19.5', waist: '18', hips: '20.5', length: '39' },
                      { size: 'M',  pk: '12', shoulders: '14.5', chest: '20.5', waist: '19.5', hips: '22.5', length: '40' },
                      { size: 'L',  pk: '14', shoulders: '15.5', chest: '22.0', waist: '21', hips: '24.5', length: '41' },
                    ].map((row, i) => (
                      <tr key={row.size} style={{ background: i % 2 === 0 ? '#fff' : '#FBF7F4' }}>
                        <td className="py-4 px-5 font-playfair font-semibold text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>{row.size}</td>
                        <td className="py-4 px-5 text-sm text-brown-muted font-inter">{row.pk}</td>
                        <td className="py-4 px-5 text-sm text-brown/80 font-inter">{row.shoulders}&quot;</td>
                        <td className="py-4 px-5 text-sm text-brown/80 font-inter">{row.chest}&quot;</td>
                        <td className="py-4 px-5 text-sm text-brown/80 font-inter">{row.waist}&quot;</td>
                        <td className="py-4 px-5 text-sm text-brown/80 font-inter">{row.hips}&quot;</td>
                        <td className="py-4 px-5 text-sm text-brown/80 font-inter">{row.length}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Per-product size charts */}
        {!loading && displayProducts.length > 0 && (
          <div className="flex flex-col gap-16">
            {displayProducts.map((p, i) => {
              const isHighlighted = p.productId === productId;
              const tips = getMeasureTips(p.sizeChartRows);
              return (
                <motion.div
                  id={`chart-${p.productId}`}
                  key={p.productId}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: i * 0.1 }}
                >
                  {/* Product header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #B76E79, #E6B7A9)' }} />
                    <h2 className="text-2xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}</h2>
                    {isHighlighted && (
                      <span className="text-xs font-inter font-semibold px-3 py-1 rounded-full text-white" style={{ background: '#B76E79', fontFamily: "'Inter', sans-serif" }}>
                        Your Selected Product
                      </span>
                    )}
                    <Link
                      href={`/product/${p.productId}`}
                      className="ml-auto text-xs font-inter underline text-brown-muted hover:text-brown transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      View Product →
                    </Link>
                  </div>

                  {/* Size chart image */}
                  {p.sizeChartImageUrl && (
                    <div
                      className="rounded-2xl overflow-hidden border border-nude/30 shadow-xl shadow-brown/5 mb-8"
                      style={{ background: '#fff' }}
                    >
                      {/* Themed header bar */}
                      <div className="px-6 py-3 flex items-center gap-3" style={{ background: 'linear-gradient(to right, #3A2E2A, #6B5247)' }}>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                        </div>
                        <span className="text-white/70 text-xs font-inter tracking-[0.12em] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Size Chart — {p.name}
                        </span>
                      </div>
                      {/* Image */}
                      <div className="p-4 sm:p-6 bg-white">
                        <Image
                          src={p.sizeChartImageUrl}
                          alt={`${p.name} size chart`}
                          width={1200}
                          height={1200}
                          className="w-full h-auto object-contain"
                          style={{ maxHeight: '70vh', objectFit: 'contain' }}
                        />
                      </div>
                      {/* Subtle footer */}
                      <div className="px-6 py-3 border-t border-nude/10" style={{ background: '#FBF7F4' }}>
                        <p className="text-xs text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                          All measurements are in inches. When between sizes, we recommend sizing up.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fallback data table if no image */}
                  {!p.sizeChartImageUrl && p.sizeChartRows && p.sizeChartRows.length > 0 && (
                    <div className="rounded-2xl overflow-hidden border border-nude/30 shadow-xl shadow-brown/5 mb-8 bg-white">
                      <div className="px-6 py-4 border-b border-nude/20" style={{ background: 'linear-gradient(to right, #3A2E2A, #6B5247)' }}>
                        <p className="text-white/60 text-xs font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>All measurements in inches</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr style={{ background: '#F5EDE6' }}>
                              {['Size', 'Chest', 'Waist', 'Hips', 'Length'].map((h) => (
                                <th key={h} className="py-3 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-brown font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {p.sizeChartRows.map((row, ri) => (
                              <tr key={row.size} style={{ background: ri % 2 === 0 ? '#fff' : '#FBF7F4' }}>
                                <td className="py-4 px-5 font-playfair font-semibold text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>{row.size}</td>
                                <td className="py-4 px-5 text-sm text-brown/80 font-inter">{row.chest}&quot;</td>
                                <td className="py-4 px-5 text-sm text-brown/80 font-inter">{row.waist}&quot;</td>
                                <td className="py-4 px-5 text-sm text-brown/80 font-inter">{row.hips}&quot;</td>
                                <td className="py-4 px-5 text-sm text-brown/80 font-inter">{row.length}&quot;</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Measuring tips — based on actual size chart columns */}
                  <div className={`grid grid-cols-1 gap-4 ${tips.length <= 2 ? 'sm:grid-cols-2' : tips.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
                    {tips.map(([key, tip]) => (
                      <div
                        key={key}
                        className="border border-nude/20 p-5 rounded-xl hover:shadow-md transition-all duration-300"
                        style={{ background: 'linear-gradient(135deg, #fff 0%, #FBF7F4 100%)' }}
                      >
                        <h3
                          className="font-playfair text-lg text-brown mb-2 capitalize"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {key}
                        </h3>
                        <p className="text-xs font-inter text-brown-muted leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom note */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-xs font-inter text-brown-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
              Still unsure about your size?{' '}
              <Link href="/contact" className="underline text-brown hover:text-rose-gold transition-colors">
                Contact us
              </Link>{' '}
              and we&apos;ll help you find the perfect fit.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="pt-32 pb-24 bg-cream min-h-screen flex items-center justify-center">
          <p className="text-brown-muted font-inter text-sm">Loading size guide...</p>
        </div>
      }>
        <SizeGuideContent />
      </Suspense>
    </AppShell>
  );
}
