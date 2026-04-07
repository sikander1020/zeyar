'use client';

import AppShell from '@/components/layout/AppShell';
import { motion } from 'framer-motion';

export default function ReturnsPage() {
  return (
    <AppShell>
      <div className="pt-32 pb-24 bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-[0.3em] uppercase text-rose-gold font-inter block mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Customer Care
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-playfair text-brown mb-6" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Return <span className="italic" style={{ color: '#E6B7A9' }}>Policy</span>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="prose prose-brown max-w-none text-brown-muted font-inter leading-relaxed bg-white/40 border border-nude/20 rounded-xl p-8 md:p-12 shadow-xl shadow-brown/5 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-playfair text-brown mb-4">Our Commitment</h2>
            <p className="mb-8">
              At ZEYAR, we take immense pride in the craftsmanship and quality of our pieces. We want you to love your 
              purchase completely. If for any reason you are not entirely satisfied, we proudly offer a transparent and 
              hassle-free exchange and return policy tailored for our clients globally and across Pakistan.
            </p>

            <h2 className="text-2xl font-playfair text-brown mb-4">14-Day Exchange & Return Policy</h2>
            <p className="mb-4">
              Items purchased from ZEYAR are eligible for a return or exchange within <strong>14 days of delivery</strong>, 
              provided they meet our strict quality criteria:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>The garment must be unworn, unwashed, and completely unaltered.</li>
              <li>All original ZEYAR tags, security ribbons, and packaging must remain completely intact and attached.</li>
              <li>A valid receipt or proof of purchase must be presented.</li>
            </ul>

            <h2 className="text-2xl font-playfair text-brown mb-4">Non-Returnable Items</h2>
            <p className="mb-8">
              For hygiene reasons and the bespoke nature of luxury fashion, the following items cannot be returned or exchanged:
            </p>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Discounted or clearance items purchased during sales.</li>
              <li>Custom-fitted, altered, or Made-to-Order exquisite formal wear.</li>
              <li>Jewelry and intimate delicate accessories.</li>
            </ul>

            <h2 className="text-2xl font-playfair text-brown mb-4">How to Initiate a Request</h2>
            <p className="mb-4">
              To request a return or exchange, simply reach out to our Concierge Team. Please provide your order number and 
              the reason for the request. 
            </p>
            <p className="mb-8">
              Once your returned item is received at our studio and inspected, we will notify you of the approval. Approved 
              returns will be credited back to your original method of payment within 7-10 business days.
            </p>
            
            <div className="bg-nude/10 border-l-4 border-rose-gold p-6 mt-12 rounded-r-lg">
              <h3 className="text-lg font-playfair text-brown mb-2">Need Assistance?</h3>
              <p className="text-sm">
                Our support partners are available virtually from Monday to Saturday, 10:00 AM — 6:00 PM (PKT).
                <br /><br />
                <strong>Email:</strong> care@zeyar.me<br />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
