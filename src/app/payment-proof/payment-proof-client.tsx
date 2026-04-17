'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';

export default function PaymentProofClient() {
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME ?? 'JazzCash';
  const bankAccountTitle = process.env.NEXT_PUBLIC_BANK_ACCOUNT_TITLE ?? 'Muhammad Umair';
  const bankAccountNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? '03219643246';

  const params = useSearchParams();
  const orderId = useMemo(() => (params.get('orderId') ?? '').trim(), [params]);
  const token = useMemo(() => (params.get('token') ?? '').trim(), [params]);

  const [transactionId, setTransactionId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setError('');
    if (!orderId || !token) { setError('Invalid link. Please use the link provided after checkout.'); return; }
    if (!transactionId.trim()) { setError('Transaction ID is required.'); return; }
    if (!file) { setError('Payment proof image is required.'); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('orderId', orderId);
      fd.append('token', token);
      fd.append('transactionId', transactionId.trim());
      fd.append('file', file);

      const res = await fetch('/api/bank-proof', { method: 'POST', body: fd });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Upload failed. Please try again.');
        return;
      }
      setDone(true);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="pt-24 min-h-screen bg-cream">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-playfair text-brown mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bank Transfer Proof
          </h1>
          <p className="text-brown-muted font-inter mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            Upload your bank transfer screenshot so we can verify your payment.
          </p>

          <div className="glass p-6 border border-nude/20 mb-8">
            <p className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Order ID
            </p>
            <p className="font-mono text-brown text-sm">{orderId || '—'}</p>
          </div>

          <div className="bg-white border border-nude/30 rounded-lg p-6 mb-8">
            <p className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Where to pay
            </p>
            <div className="text-sm text-brown font-inter space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div><span className="text-brown-muted">Bank:</span> {bankName}</div>
              <div><span className="text-brown-muted">Account Title:</span> {bankAccountTitle}</div>
              <div><span className="text-brown-muted">Account / IBAN:</span> {bankAccountNumber}</div>
            </div>
            <p className="text-xs text-brown-muted font-inter mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              After paying, upload the screenshot below and enter the transaction reference.
            </p>
          </div>

          {done ? (
            <div className="bg-white border border-nude/30 rounded-lg p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-playfair text-brown mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Proof submitted
              </h2>
              <p className="text-brown-muted font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                We’ll verify your payment shortly. You’ll be contacted on your provided phone/email if needed.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-nude/30 rounded-lg p-8">
              <div className="mb-6">
                <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Transaction ID / Reference
                </label>
                <input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="input-luxury"
                  placeholder="e.g. TRX123456789"
                />
              </div>

              <div className="mb-6">
                <label className="text-xs tracking-[0.12em] uppercase text-brown-muted font-inter block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Proof image (jpg/png/webp, max 5MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-brown-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-rose-gold file:text-white hover:file:bg-rose-gold/90"
                />
                {file && (
                  <p className="text-xs text-brown-muted mt-2 font-inter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={submit}
                disabled={submitting}
                className="btn-luxury btn-primary w-full"
              >
                {submitting ? 'Uploading…' : 'Submit proof'}
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

