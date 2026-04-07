'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, CreditCard } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const { items, total, clearCart } = useCartStore();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'Pakistan',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handlePlaceOrder = () => {
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <AppShell>
        <div className="pt-24 min-h-screen bg-cream flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <div className="text-6xl mb-8">🌹</div>
            <h1 className="text-4xl font-playfair text-brown mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Order Placed
            </h1>
            <div className="divider-rose" />
            <p className="text-brown-muted font-inter my-6 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Thank you for choosing ZEYAR. Your order has been confirmed and will be beautifully packaged and dispatched within 2-3 business days.
            </p>
            <p className="text-sm text-brown-muted font-inter mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              A confirmation has been sent to your email.
            </p>
            <Link href="/shop" className="btn-luxury btn-primary">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Secure Checkout
            </span>
            <h1 className="text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
              Complete <span className="italic gradient-rose-text">Your Order</span>
            </h1>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-0 mb-12 max-w-xs">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold font-inter border-2 transition-all duration-300 ${i <= step ? 'bg-rose-gold border-rose-gold text-white' : 'border-nude text-brown-muted'}`}>
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px transition-all duration-300 ${i < step ? 'bg-rose-gold' : 'bg-nude/40'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Step 0: Shipping */}
              {step === 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-xl font-playfair text-brown mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>First Name</label>
                      <input value={form.firstName} onChange={e => update('firstName', e.target.value)} className="input-luxury" placeholder="Layla" />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Last Name</label>
                      <input value={form.lastName} onChange={e => update('lastName', e.target.value)} className="input-luxury" placeholder="Al-Rashid" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Email</label>
                      <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-luxury" placeholder="layla@email.com" />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Phone</label>
                      <input value={form.phone} onChange={e => update('phone', e.target.value)} className="input-luxury" placeholder="+92 300 1234567" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Address</label>
                    <input value={form.address} onChange={e => update('address', e.target.value)} className="input-luxury" placeholder="123 Luxury Lane, Suite 4" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>City</label>
                      <input value={form.city} onChange={e => update('city', e.target.value)} className="input-luxury" placeholder="Karachi" />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>State</label>
                      <input value={form.state} onChange={e => update('state', e.target.value)} className="input-luxury" placeholder="Sindh" />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>ZIP</label>
                      <input value={form.zip} onChange={e => update('zip', e.target.value)} className="input-luxury" placeholder="75500" />
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="btn-luxury btn-primary w-full">
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 1: Payment */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-xl font-playfair text-brown mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Payment Details
                  </h2>
                  <div className="glass p-6 mb-6 border border-nude/20">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard size={18} className="text-rose-gold" strokeWidth={1.5} />
                      <span className="text-sm font-inter text-brown" style={{ fontFamily: "'Inter', sans-serif" }}>Credit / Debit Card</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Name on Card</label>
                        <input value={form.cardName} onChange={e => update('cardName', e.target.value)} className="input-luxury" placeholder="Layla Al-Rashid" />
                      </div>
                      <div>
                        <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Card Number</label>
                        <input value={form.cardNumber} onChange={e => update('cardNumber', e.target.value)} className="input-luxury" placeholder="4242 4242 4242 4242" maxLength={19} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>Expiry</label>
                          <input value={form.expiry} onChange={e => update('expiry', e.target.value)} className="input-luxury" placeholder="MM / YY" />
                        </div>
                        <div>
                          <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>CVV</label>
                          <input value={form.cvv} onChange={e => update('cvv', e.target.value)} className="input-luxury" placeholder="•••" maxLength={4} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-brown-muted font-inter mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Lock size={13} className="text-rose-gold" strokeWidth={1.5} />
                    Your payment information is encrypted and secure.
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="btn-luxury btn-outline">
                      Back
                    </button>
                    <button onClick={() => setStep(2)} className="btn-luxury btn-primary flex-1">
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-xl font-playfair text-brown mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Review & Place Order
                  </h2>
                  <div className="glass p-6 mb-6 space-y-2">
                    <h3 className="text-xs tracking-[0.15em] uppercase text-brown-muted font-inter mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Shipping to</h3>
                    <p className="text-sm font-inter text-brown" style={{ fontFamily: "'Inter', sans-serif" }}>{form.firstName} {form.lastName}</p>
                    <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{form.address}, {form.city}</p>
                    <p className="text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{form.email}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-luxury btn-outline">
                      Back
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      className="btn-luxury btn-rose flex-1 flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={16} strokeWidth={2} />
                      Place Order — ${(total() * 1.08).toFixed(0)}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-beige p-6 sticky top-28">
                <h3 className="text-base font-playfair text-brown mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Your Order ({items.length})
                </h3>
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3 text-sm">
                      <div className="w-14 h-18 relative bg-cream-dark flex-shrink-0" style={{ height: '72px' }}>
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-playfair text-brown text-xs" style={{ fontFamily: "'Playfair Display', serif" }}>{item.product.name}</p>
                        <p className="text-brown-muted font-inter text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>Qty: {item.quantity} · {item.selectedSize}</p>
                        <p className="text-brown font-semibold font-inter text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>${item.product.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-nude/30 pt-4 space-y-2">
                  <div className="flex justify-between text-sm font-inter text-brown-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span>Subtotal</span><span>${total().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-inter text-brown-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span>Shipping</span><span className="text-rose-gold">Free</span>
                  </div>
                  <div className="flex justify-between font-playfair font-semibold text-brown pt-2 border-t border-nude/20" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span>Total</span><span>${(total() * 1.08).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
