'use client';

import AppShell from '@/components/layout/AppShell';
import { motion } from 'framer-motion';

const dimensions = [
  { size: 'XS', uk: '8', shoulders: '13.5', chest: '18.5', waist: '17', hips: '19.5', length: '38' },
  { size: 'S',  uk: '10', shoulders: '14.0', chest: '19.5', waist: '18', hips: '20.5', length: '39' },
  { size: 'M',  uk: '12', shoulders: '14.5', chest: '20.5', waist: '19.5', hips: '22.5', length: '40' },
  { size: 'L',  uk: '14', shoulders: '15.5', chest: '22.0', waist: '21', hips: '24.5', length: '41' },
  { size: 'XL', uk: '16', shoulders: '16.5', chest: '23.5', waist: '22.5', hips: '26.0', length: '42' },
];

export default function SizeGuidePage() {
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
              Find your perfect ZEYAR fit. Our signature ready-to-wear silhouettes reflect standard Eastern 
              sizing (commonly adopted by premium Pakistani brands) designed for elegant draping and maximum comfort.
            </motion.p>
          </div>

          {/* Table */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="glass rounded-xl overflow-hidden border border-nude/20 bg-white/50 relative backdrop-blur-sm shadow-xl shadow-brown/5"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-brown text-cream text-xs uppercase tracking-[0.15em] font-inter">
                    <th className="py-5 px-6 font-semibold">Size</th>
                    <th className="py-5 px-6 font-semibold">UK Size</th>
                    <th className="py-5 px-6 font-semibold">Shoulder (in)</th>
                    <th className="py-5 px-6 font-semibold">Chest (in)</th>
                    <th className="py-5 px-6 font-semibold">Waist (in)</th>
                    <th className="py-5 px-6 font-semibold">Hips (in)</th>
                    <th className="py-5 px-6 font-semibold">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nude/20">
                  {dimensions.map((row) => (
                    <tr key={row.size} className="hover:bg-cream/40 transition-colors duration-200">
                      <td className="py-5 px-6 text-brown font-playfair font-semibold text-lg">{row.size}</td>
                      <td className="py-5 px-6 text-brown-muted font-inter text-sm">{row.uk}</td>
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

          {/* Measuring Guide Info */}
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
