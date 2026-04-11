'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, CreditCard, Landmark, Truck } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'Pakistan',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'bank'>('COD');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    total: number;
  } | null>(null);

  const subtotal = total();
  const discount = appliedCoupon?.discount ?? 0;
  const netTotal = Math.max(0, subtotal - discount);
  const finalTotal = netTotal * 1.08;

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handlePlaceOrder = useCallback(async () => {
    try {
      setSubmitError('');
      const payload = {
        customer: {
          firstName: form.firstName, lastName: form.lastName,
          email: form.email,         phone: form.phone,
          address: form.address,     city: form.city,
          state: form.state,         zip: form.zip,
          country: form.country,
        },
        items: items.map(i => ({
          productId: i.product.id,
          name:      i.product.name,
          category:  i.product.category ?? '',
          qty:       i.quantity,
          // price is recalculated server-side
          size:      i.selectedSize ?? '',
          color:     i.selectedColor?.name ?? '',
        })),
        subtotal,
        discount,
        total: netTotal,
        paymentMethod,
        couponCode: appliedCoupon?.code ?? '',
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as { success?: boolean; orderId?: string; uploadToken?: string; error?: string };
      if (!res.ok || !data.success || !data.orderId) {
        setSubmitError(data.error ?? 'Order failed. Please try again.');
        return;
      }

      // Bank transfer: redirect to secure proof upload page
      if (paymentMethod === 'bank') {
        router.push(`/payment-proof?orderId=${encodeURIComponent(data.orderId)}&token=${encodeURIComponent(data.uploadToken ?? '')}`);
        clearCart();
        return;
      }
    } catch (e) {
      console.error('Order save failed:', e);
      setSubmitError('Order failed. Please try again.');
      return;
    }
    setPlaced(true);
    clearCart();
  }, [form, items, subtotal, discount, netTotal, paymentMethod, appliedCoupon, router, clearCart]);

  const applyCoupon = useCallback(async () => {
    setCouponError('');
    setCouponApplying(true);
    try {
      const code = couponCode.trim();
      if (!code) {
        setCouponError('Enter a coupon code.');
        setCouponApplying(false);
        return;
      }

      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          items: items.map((i) => ({
            productId: i.product.id,
            category: i.product.category,
            qty: i.quantity,
            price: i.product.price,
          })),
        }),
      });

      const data = await res.json() as {
        valid?: boolean;
        coupon?: { code: string };
        discount?: number;
        total?: number;
        error?: string;
      };

      if (!res.ok || !data.valid || !data.coupon) {
        setCouponError(data.error ?? 'Invalid coupon.');
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon({
        code: data.coupon.code,
        discount: Number(data.discount) || 0,
        total: Number(data.total) || subtotal,
      });
    } catch {
      setCouponError('Could not validate coupon.');
      setAppliedCoupon(null);
    } finally {
      setCouponApplying(false);
    }
  }, [couponCode, items, subtotal]);

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
              Thank you for choosing ZAYBAASH. Your order has been confirmed and will be beautifully packaged and dispatched within 2-3 business days.
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`glass p-6 border transition-all ${paymentMethod === 'COD' ? 'border-rose-gold/60' : 'border-nude/20'}`}
                      style={{ textAlign: 'left' }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Truck size={18} className="text-rose-gold" strokeWidth={1.5} />
                        <span className="text-sm font-inter text-brown" style={{ fontFamily: "'Inter', sans-serif" }}>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-xs text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Pay when the parcel is delivered.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`glass p-6 border transition-all ${paymentMethod === 'bank' ? 'border-rose-gold/60' : 'border-nude/20'}`}
                      style={{ textAlign: 'left' }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Landmark size={18} className="text-rose-gold" strokeWidth={1.5} />
                        <span className="text-sm font-inter text-brown" style={{ fontFamily: "'Inter', sans-serif" }}>Bank Transfer</span>
                      </div>
                      <p className="text-xs text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Place order, then upload payment proof to confirm.
                      </p>
                    </button>
                  </div>

                  {paymentMethod === 'bank' && (
                    <div className="bg-white border border-nude/30 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <CreditCard size={18} className="text-rose-gold" strokeWidth={1.5} />
                        <span className="text-sm font-inter text-brown" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Bank transfer instructions
                        </span>
                      </div>
                      <p className="text-sm text-brown-muted font-inter mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Send payment to the account below. After you place the order, you’ll be redirected to upload your payment screenshot + transaction reference.
                      </p>
                      <div className="glass p-4 border border-nude/20">
                        <p className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Bank Account
                        </p>
                        <div className="text-sm text-brown font-inter space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <div><span className="text-brown-muted">Bank:</span> (add your bank name)</div>
                          <div><span className="text-brown-muted">Account Title:</span> (add title)</div>
                          <div><span className="text-brown-muted">Account / IBAN:</span> (add number)</div>
                        </div>
                        <p className="text-xs text-brown-muted font-inter mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Note: Use your Order ID as reference if your bank app allows it.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-brown-muted font-inter mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Lock size={13} className="text-rose-gold" strokeWidth={1.5} />
                    Your order data is encrypted and secure.
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
                      Place Order — ${finalTotal.toFixed(0)}
                    </motion.button>
                  </div>
                  {submitError && (
                    <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                      {submitError}
                    </div>
                  )}
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
                  <div className="pb-3 border-b border-nude/20">
                    <p className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Coupon
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="input-luxury"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponApplying}
                        className="btn-luxury btn-outline"
                      >
                        {couponApplying ? 'Applying...' : 'Apply'}
                      </button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-xs text-rose-gold font-inter mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Applied: {appliedCoupon.code}
                      </p>
                    )}
                    {couponError && (
                      <p className="text-xs text-red-600 font-inter mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {couponError}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between text-sm font-inter text-brown-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span>Subtotal</span><span>${subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-inter text-brown-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span>Discount</span><span>- ${discount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-inter text-brown-muted" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span>Shipping</span><span className="text-rose-gold">Free</span>
                  </div>
                  <div className="flex justify-between font-playfair font-semibold text-brown pt-2 border-t border-nude/20" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <span>Total</span><span>${finalTotal.toFixed(0)}</span>
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
