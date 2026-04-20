'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';

type TrackResponse = {
  order: {
    orderId: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    total: number;
    createdAt: string;
    updatedAt: string;
    customerName: string;
    city: string;
    bankTransferStatus: string;
  };
  timeline: Array<{ key: string; label: string; done: boolean }>;
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<TrackResponse | null>(null);

  async function onTrack(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);

    try {
      const q = new URLSearchParams({ orderId: orderId.trim(), email: email.trim().toLowerCase() });
      const res = await fetch(`/api/orders/track?${q.toString()}`);
      const json = await res.json() as TrackResponse & { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Unable to track order.');
        return;
      }
      setData(json);
    } catch {
      setError('Unable to track order right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="pt-28 min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-inter block mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Order Support
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
              Track <span className="italic gradient-rose-text">Your Order</span>
            </h1>
          </div>

          <form onSubmit={onTrack} className="bg-white/40 border border-nude/20 rounded-xl p-6 md:p-8 shadow-xl shadow-brown/5 backdrop-blur-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Order ID
                </label>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)} className="input-luxury" placeholder="ORD-202604-1234" required />
              </div>
              <div>
                <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Email Used in Order
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-luxury" placeholder="you@email.com" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-luxury btn-primary mt-5 w-full md:w-auto">
              {loading ? 'Checking...' : 'Track Order'}
            </button>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </form>

          {data && (
            <div className="bg-white border border-nude/20 rounded-xl p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>Order</p>
                  <p className="text-lg text-brown font-semibold font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>{data.order.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>Current Status</p>
                  <p className="text-sm text-rose-gold font-semibold font-inter uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>{data.order.status}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div><span className="text-brown">Customer:</span> {data.order.customerName || 'Guest'}</div>
                <div><span className="text-brown">City:</span> {data.order.city || 'N/A'}</div>
                <div><span className="text-brown">Total:</span> Rs {Number(data.order.total).toLocaleString()}</div>
                <div><span className="text-brown">Payment:</span> {data.order.paymentMethod} ({data.order.paymentStatus})</div>
                {data.order.bankTransferStatus && (
                  <div><span className="text-brown">Bank Proof:</span> {data.order.bankTransferStatus}</div>
                )}
                <div><span className="text-brown">Placed:</span> {new Date(data.order.createdAt).toLocaleString()}</div>
              </div>

              <div className="space-y-3">
                {data.timeline.map((step) => (
                  <div key={step.key} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${step.done ? 'bg-rose-gold border-rose-gold text-white' : 'border-nude text-brown-muted'}`}>
                      {step.done ? '✓' : ''}
                    </span>
                    <p className={`text-sm font-inter ${step.done ? 'text-brown' : 'text-brown-muted'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
