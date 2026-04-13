'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ── Brand palette ────────────────────────────────────────────────────────────
const COLORS = ['#B76E79', '#E6B7A9', '#D4957F', '#6B5247', '#9A7B72', '#F0C9BF', '#3A2E2A', '#D4919A'];
const ROSE   = '#B76E79';
const BROWN  = '#3A2E2A';
const CREAM  = '#FAF7F4';
const BEIGE  = '#F5EDE6';
const MUTED  = '#9A7B72';

/** How often to pull fresh data from MongoDB (orders, inventory, stats). */
const POLL_MS = 15_000;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Summary {
  totalRevenue: number; totalOrders: number; avgOrderValue: number;
  totalDiscount: number; pendingOrders: number; confirmedOrders: number;
  shippedOrders: number; deliveredOrders: number; cancelledOrders: number;
  totalCOGS: number; grossProfit: number; profitMargin: number;
}
interface Order {
  orderId: string; customerName: string; customerEmail: string;
  customerCity: string; total: number; discount: number;
  paymentMethod: string; paymentStatus: string; status: string;
  bankTransferStatus?: string;
  date: string; time?: string; placedAt?: string; month: string;
}
interface OrderItem {
  orderId: string; productId: string; name: string; category: string;
  qty: number; price: number; size: string; color: string; lineTotal: number; date: string;
}
interface DailyRevenue  { date: string; revenue: number; orders: number }
interface MonthlyRevenue { month: string; revenue: number; orders: number }
interface CategoryRevenue { category: string; revenue: number; units: number }
interface TopProduct    { productId: string; name: string; category: string; unitsSold: number; revenue: number }
interface PaymentSplit  { method: string; count: number; revenue: number }
interface OrderStatus   { status: string; count: number }
interface CityStats     { city: string; orders: number; revenue: number; avgSpend: number; pctOfOrders: number }
interface Customer      { email: string; name: string; city: string; state: string; orderCount: number; totalSpend: number }
interface InventoryItem {
  productId: string; name: string; category: string; price: number;
  costPrice: number; margin: number; stock: number; sold: number;
  stockValue: number; revenueValue: number;
}
interface BankProofRow {
  orderId: string;
  customer: { firstName?: string; lastName?: string; email?: string; city?: string };
  createdAt?: string;
  total: number;
  bankTransfer?: { transactionId?: string; proofUrl?: string; submittedAt?: string };
}
interface CategoryRow {
  categoryId: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
}
interface ProductRow {
  productId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  costPrice: number;
  stock: number;
  sold: number;
  images?: string[];
  description?: string;
  details?: string[];
  sizes?: string[];
  colors?: Array<{ name: string; hex: string }>;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isActive: boolean;
  outOfStock: boolean;
  isNewArrival: boolean;
  isSale: boolean;
  isBestseller: boolean;
}
interface CouponRow {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
interface ReviewRow {
  reviewId: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  createdAt: string;
}
interface DashData {
  summary: Summary[]; orders: Order[]; orderItems: OrderItem[];
  dailyRevenue: DailyRevenue[]; monthlyRevenue: MonthlyRevenue[];
  categoryRevenue: CategoryRevenue[]; topProducts: TopProduct[];
  paymentSplit: PaymentSplit[]; orderStatus: OrderStatus[];
  cityStats: CityStats[]; customers: Customer[]; inventory: InventoryItem[];
  _error?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt  = (n: number) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);
const fmtN = (n: number) => new Intl.NumberFormat('en').format(n);

// Recharts tooltip formatter — typed to avoid ValueType/NameType mismatch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFmt = (value: any) => [string, string] | string;

function KpiCard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div style={{
      background: '#fff', border: `1px solid #EBD9CC`, borderRadius: 12,
      padding: '20px 24px', boxShadow: '0 1px 4px rgba(58,46,42,.06)',
    }}>
      <p style={{ margin: 0, fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 700, color: accent ? ROSE : BROWN }}>{value}</p>
      {sub && <p style={{ margin: '4px 0 0', fontSize: 12, color: MUTED }}>{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600, color: BROWN, borderLeft: `3px solid ${ROSE}`, paddingLeft: 12 }}>
      {children}
    </h2>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: '#F0C9BF', confirmed: '#B7D7C0', shipped: '#B7C9D7',
    delivered: '#6B8E6B', cancelled: '#D7B7B7',
    rejected: '#C0504D',
  };
  return (
    <span style={{
      background: map[status] ?? '#EBD9CC', color: BROWN,
      borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 500,
    }}>{status}</span>
  );
}

const TABS = [
  { id: 'overview',   label: 'Overview',       icon: '▦' },
  { id: 'sales',      label: 'Sales',           icon: '◈' },
  { id: 'orders',     label: 'Orders',          icon: '≡' },
  { id: 'products',   label: 'Products',        icon: '◉' },
  { id: 'categories', label: 'Categories',      icon: '▤' },
  { id: 'inventory',  label: 'Inventory',       icon: '▤' },
  { id: 'customers',  label: 'Customers',       icon: '⊙' },
  { id: 'coupons',    label: 'Coupons',         icon: '🏷' },
  { id: 'reviews',    label: 'Reviews',         icon: '★' },
  { id: 'finance',    label: 'Finance',         icon: '₨' },
  { id: 'locations',  label: 'Locations',       icon: '⊙' },
  { id: 'bankProofs', label: 'Bank Proofs',     icon: '✓' },
];

// ── Login Wall ────────────────────────────────────────────────────────────────
function LoginWall({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw]     = useState('');
  const [err, setErr]   = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json() as { token?: string; ts?: number; error?: string };
      if (!res.ok || !data.token) {
        setErr('Incorrect password');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      } else {
        localStorage.setItem('zaybaash_admin_token', data.token);
        localStorage.setItem('zaybaash_admin_ts',    String(data.ts));
        onLogin();
      }
    } catch {
      setErr('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, ${BROWN} 0%, #6B5247 100%)`,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px', width: 360,
        boxShadow: '0 20px 60px rgba(0,0,0,.3)',
        animation: shake ? 'shake 0.5s ease' : undefined,
      }}>
        <style>{`
          @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%{transform:translateX(-8px)}
            40%{transform:translateX(8px)}
            60%{transform:translateX(-6px)}
            80%{transform:translateX(6px)}
          }
        `}</style>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: BROWN }}>ZAYBAASH Admin</h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: MUTED }}>Dashboard access is restricted</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password" value={pw} onChange={(e) => setPw(e.target.value)}
            placeholder="Enter admin password"
            style={{
              width: '100%', padding: '12px 16px', border: `1px solid ${err ? '#C0504D' : '#EBD9CC'}`,
              borderRadius: 8, fontSize: 14, color: BROWN, background: CREAM,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          {err && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#C0504D' }}>{err}</p>}
          <button
            type="submit" disabled={loading || !pw}
            style={{
              width: '100%', marginTop: 16, padding: '12px', background: loading ? MUTED : ROSE,
              color: '#fff', border: 'none', borderRadius: 8, fontSize: 14,
              fontWeight: 600, cursor: loading ? 'default' : 'pointer', transition: 'background .2s',
            }}
          >
            {loading ? 'Verifying…' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ data }: { data: DashData }) {
  const s = data.summary[0];
  const hasError = data._error;
  
  if (!s) return <p style={{ color: MUTED }}>No data yet. Place your first order to see stats.</p>;
  
  // Show warning if there was a database error but we still loaded the dashboard
  if (hasError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ padding: 20, background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: 12 }}>
          <p style={{ margin: '0 0 8px', color: '#C0504D', fontSize: 14, fontWeight: 600 }}>⚠️ Database Connection Issue</p>
          <p style={{ margin: 0, color: '#C0504D', fontSize: 13 }}>
            Could not connect to MongoDB. Dashboard is showing empty data.
          </p>
          <p style={{ margin: '8px 0 0', color: '#C0504D', fontSize: 12 }}>
            Error: {hasError}
          </p>
          <p style={{ margin: '12px 0 0', fontSize: 13, color: BROWN }}>
            <strong>To fix this:</strong>
          </p>
          <ul style={{ margin: '8px 0 0', fontSize: 13, color: BROWN, lineHeight: 1.8 }}>
            <li>Check your internet connection</li>
            <li>Verify MongoDB Atlas IP whitelist includes your IP</li>
            <li>Check MongoDB credentials in .env.local</li>
            <li>Restart the dev server after fixing</li>
          </ul>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
          <KpiCard label="Total Revenue" value={fmt(s.totalRevenue)} accent />
          <KpiCard label="Total Orders" value={fmtN(s.totalOrders)} />
          <KpiCard label="Gross Profit" value={fmt(s.grossProfit)} accent />
          <KpiCard label="Profit Margin" value={`${s.profitMargin}%`} />
          <KpiCard label="Avg Order Value" value={fmt(s.avgOrderValue)} />
          <KpiCard label="Total Discounts" value={fmt(s.totalDiscount)} />
        </div>
      </div>
    );
  }

  const statusCards = [
    { label: 'Pending',   value: s.pendingOrders },
    { label: 'Confirmed', value: s.confirmedOrders },
    { label: 'Shipped',   value: s.shippedOrders },
    { label: 'Delivered', value: s.deliveredOrders },
    { label: 'Cancelled', value: s.cancelledOrders },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
        <KpiCard label="Total Revenue"   value={fmt(s.totalRevenue)}   accent />
        <KpiCard label="Total Orders"    value={fmtN(s.totalOrders)} />
        <KpiCard label="Gross Profit"    value={fmt(s.grossProfit)}    accent />
        <KpiCard label="Profit Margin"   value={`${s.profitMargin}%`} />
        <KpiCard label="Avg Order Value" value={fmt(s.avgOrderValue)} />
        <KpiCard label="Total Discounts" value={fmt(s.totalDiscount)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        {statusCards.map((c) => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: BROWN }}>{c.value}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: MUTED, textTransform: 'uppercase' }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <SectionTitle>Daily Revenue — Last 90 Days</SectionTitle>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data.dailyRevenue}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={ROSE} stopOpacity={0.25} />
                <stop offset="95%" stopColor={ROSE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => String(v).slice(5)} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(Number(v)/1000).toFixed(0)}k`} />
            <Tooltip formatter={((v) => [fmt(v as number), 'Revenue']) as TFmt} />
            <Area type="monotone" dataKey="revenue" stroke={ROSE} strokeWidth={2.5} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <SectionTitle>Order Status</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.orderStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {data.orderStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <SectionTitle>Payment Methods</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.paymentSplit} dataKey="revenue" nameKey="method" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {data.paymentSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={((v) => [fmt(v as number), 'Revenue']) as TFmt} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ── Sales Tab ─────────────────────────────────────────────────────────────────
function SalesTab({ data }: { data: DashData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <SectionTitle>Top Products by Units Sold</SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.topProducts.slice(0, 10)} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
            <Tooltip formatter={((v) => [fmtN(v as number), 'Units Sold']) as TFmt} />
            <Bar dataKey="unitsSold" fill={ROSE} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <SectionTitle>Revenue by Category</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data.categoryRevenue} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={90}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine>
                {data.categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={((v) => [fmt(v as number), 'Revenue']) as TFmt} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <SectionTitle>Revenue by Product (Top 10)</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.topProducts.slice(0, 10)} layout="vertical" margin={{ left: 110 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(Number(v)/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
              <Tooltip formatter={((v) => [fmt(v as number), 'Revenue']) as TFmt} />
              <Bar dataKey="revenue" fill="#D4957F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <SectionTitle>Monthly Order Volume</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="orders" name="Orders" fill={ROSE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Orders Tab ────────────────────────────────────────────────────────────────
function OrdersTab({ data, fetchData }: { data: DashData; fetchData?: () => void }) {
  const [search, setSearch]   = useState('');
  const [statusF, setStatusF] = useState('all');
  const [monthF,  setMonthF]  = useState('all');

  const months = Array.from(new Set(data.orders.map((o) => o.month))).sort().reverse();
  const filtered = data.orders.filter((o) => {
    const effectiveStatus =
      o.paymentMethod === 'bank' && o.bankTransferStatus === 'rejected'
        ? 'rejected'
        : o.status;
    const matchSearch = !search || o.orderId.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.customerCity.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusF === 'all' || effectiveStatus === statusF;
    const matchMonth  = monthF  === 'all' || o.month  === monthF;
    return matchSearch && matchStatus && matchMonth;
  });

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('zaybaash_admin_token') ?? '';
    const ts = localStorage.getItem('zaybaash_admin_ts') ?? '';
    return { 'x-admin-token': token, 'x-admin-ts': ts };
  }, []);

  async function resetTestData() {
    const ok = window.confirm('This will DELETE ALL orders and reset inventory. Type OK to continue.');
    if (!ok) return;
    await fetch('/api/admin/reset-test', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirm: 'RESET_TEST_DATA' }),
    });
    window.location.reload();
  }

  async function markCodReceived(orderId: string) {
    await fetch('/api/admin/orders/cod-received', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
  }

  async function updateOrderStatus(orderId: string, status: string) {
    await fetch('/api/admin/orders/update-status', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    fetchData?.();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID, name, city…"
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: '#fff', outline: 'none' }}>
          <option value="all">All Statuses</option>
          {['pending','confirmed','shipped','delivered','cancelled','rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={monthF} onChange={(e) => setMonthF(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: '#fff', outline: 'none' }}>
          <option value="all">All Months</option>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <button
          type="button"
          onClick={resetTestData}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #EBD9CC', background: '#fff', color: '#C0504D', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          title="Delete all dummy orders and reset inventory"
        >
          Clear test data
        </button>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: MUTED }}>{filtered.length} orders found</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: ROSE, color: '#fff' }}>
              {['Order ID','Customer','City','Total','Status','Payment','Placed','Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: MUTED }}>No orders match your filters.</td></tr>
            )}
            {filtered.map((o, i) => (
              <tr key={o.orderId} style={{ background: i % 2 === 0 ? '#fff' : BEIGE }}>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12 }}>{o.orderId}</td>
                <td style={{ padding: '10px 14px' }}>{o.customerName || '—'}</td>
                <td style={{ padding: '10px 14px' }}>{o.customerCity || '—'}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{fmt(o.total)}</td>
                <td style={{ padding: '10px 14px' }}>
                  <StatusBadge
                    status={
                      o.paymentMethod === 'bank' && o.bankTransferStatus === 'rejected'
                        ? 'rejected'
                        : o.status
                    }
                  />
                </td>
                <td style={{ padding: '10px 14px', textTransform: 'uppercase', fontSize: 11 }}>
                  {o.paymentMethod}{o.paymentStatus === 'paid' ? ' (paid)' : ''}
                </td>
                <td style={{ padding: '10px 14px', color: MUTED }}>
                  {o.date}{o.time ? ` ${o.time}` : ''}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {o.paymentMethod === 'COD' && o.paymentStatus !== 'paid' && o.status === 'pending' ? (
                    <button
                      onClick={() => markCodReceived(o.orderId)}
                      style={{ padding: '6px 10px', background: ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
                      title="Mark payment received and confirm order"
                    >
                      Mark received
                    </button>
                  ) : (
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.orderId, e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 12, color: BROWN, background: '#fff', outline: 'none' }}
                    >
                      {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Inventory Tab ─────────────────────────────────────────────────────────────
function InventoryTab({ data }: { data: DashData }) {
  const totalStockVal = data.inventory.reduce((s, p) => s + p.stockValue, 0);
  const avgMargin     = data.inventory.length ? data.inventory.reduce((s, p) => s + p.margin, 0) / data.inventory.length : 0;
  const inStock       = data.inventory.filter((p) => p.stock > 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <KpiCard label="Total Stock Value" value={fmt(totalStockVal)} accent />
        <KpiCard label="Avg Profit Margin" value={`${avgMargin.toFixed(1)}%`} />
        <KpiCard label="Products in Stock"  value={String(inStock)} />
      </div>

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <SectionTitle>Stock vs Sold</SectionTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.inventory} margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(v) => String(v).split(' ').slice(0, 2).join(' ')} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" name="In Stock" fill={ROSE}      radius={[4, 4, 0, 0]} />
            <Bar dataKey="sold"  name="Sold"     fill="#E6B7A9"  radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <SectionTitle>Product Inventory Details</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: ROSE, color: '#fff' }}>
                {['Product','Category','Price','Cost','Margin %','Stock','Sold','Stock Value'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.inventory.map((p, i) => (
                <tr key={p.productId} style={{ background: i % 2 === 0 ? '#fff' : BEIGE }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '10px 14px' }}>{p.category}</td>
                  <td style={{ padding: '10px 14px' }}>{fmt(p.price)}</td>
                  <td style={{ padding: '10px 14px' }}>{fmt(p.costPrice)}</td>
                  <td style={{ padding: '10px 14px', color: p.margin >= 50 ? '#6B8E6B' : ROSE, fontWeight: 600 }}>{p.margin}%</td>
                  <td style={{ padding: '10px 14px' }}>{p.stock}</td>
                  <td style={{ padding: '10px 14px' }}>{p.sold}</td>
                  <td style={{ padding: '10px 14px' }}>{fmt(p.stockValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Finance Tab ───────────────────────────────────────────────────────────────
function FinanceTab({ data }: { data: DashData }) {
  const s = data.summary[0];
  const cogsData = [
    { label: 'Revenue', value: s?.totalRevenue ?? 0 },
    { label: 'COGS',    value: s?.totalCOGS    ?? 0 },
    { label: 'Profit',  value: s?.grossProfit  ?? 0 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 }}>
        <KpiCard label="Total Revenue"   value={fmt(s?.totalRevenue   ?? 0)} accent />
        <KpiCard label="Total COGS"      value={fmt(s?.totalCOGS      ?? 0)} />
        <KpiCard label="Gross Profit"    value={fmt(s?.grossProfit    ?? 0)} accent />
        <KpiCard label="Profit Margin"   value={`${s?.profitMargin    ?? 0}%`} />
        <KpiCard label="Avg Order Value" value={fmt(s?.avgOrderValue  ?? 0)} />
        <KpiCard label="Total Discounts" value={fmt(s?.totalDiscount  ?? 0)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <SectionTitle>Revenue vs COGS vs Profit</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cogsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(Number(v)/1000).toFixed(0)}k`} />
            <Tooltip formatter={((v) => fmt(v as number)) as TFmt} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {cogsData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <SectionTitle>Payment Method Split</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.paymentSplit} dataKey="revenue" nameKey="method" cx="50%" cy="50%" outerRadius={80}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {data.paymentSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={((v) => [fmt(v as number), 'Revenue']) as TFmt} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <SectionTitle>Monthly Revenue Trend</SectionTitle>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data.monthlyRevenue}>
            <defs>
              <linearGradient id="mRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={ROSE} stopOpacity={0.2} />
                <stop offset="95%" stopColor={ROSE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(Number(v)/1000).toFixed(0)}k`} />
            <Tooltip formatter={((v) => [fmt(v as number), 'Revenue']) as TFmt} />
            <Area type="monotone" dataKey="revenue" stroke={ROSE} strokeWidth={2.5} fill="url(#mRevGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Locations Tab ─────────────────────────────────────────────────────────────
function LocationsTab({ data }: { data: DashData }) {
  const topCity      = data.cityStats[0];
  const uniqueCities = data.cityStats.length;
  const topRevCity   = [...data.cityStats].sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <KpiCard label="Top City (Orders)"  value={topCity?.city ?? '—'}       sub={`${topCity?.orders ?? 0} orders`} accent />
        <KpiCard label="Unique Cities"      value={String(uniqueCities)} />
        <KpiCard label="Top City (Revenue)" value={topRevCity?.city ?? '—'}    sub={fmt(topRevCity?.revenue ?? 0)} accent />
      </div>

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <SectionTitle>Orders by City</SectionTitle>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.cityStats} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" />
            <XAxis dataKey="city" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="orders" name="Orders" fill={ROSE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <SectionTitle>Revenue by City</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.cityStats} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(Number(v)/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="city" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={((v) => [fmt(v as number), 'Revenue']) as TFmt} />
              <Bar dataKey="revenue" fill="#D4957F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <SectionTitle>Avg Spend per City</SectionTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.cityStats} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5EDE6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(Number(v)/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="city" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={((v) => [fmt(v as number), 'Avg Spend']) as TFmt} />
              <Bar dataKey="avgSpend" fill="#6B5247" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <SectionTitle>City Rankings</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: ROSE, color: '#fff' }}>
                {['Rank','City','Orders','% of Total','Revenue','Avg Spend'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.cityStats.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: MUTED }}>No city data yet.</td></tr>
              )}
              {data.cityStats.map((c, i) => (
                <tr key={c.city} style={{ background: i % 2 === 0 ? '#fff' : BEIGE }}>
                  <td style={{ padding: '10px 14px', color: MUTED, fontWeight: 600 }}>#{i + 1}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{c.city}</td>
                  <td style={{ padding: '10px 14px' }}>{c.orders}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, background: '#F5EDE6', borderRadius: 4, height: 6 }}>
                        <div style={{ width: `${c.pctOfOrders}%`, background: ROSE, borderRadius: 4, height: '100%' }} />
                      </div>
                      <span style={{ fontSize: 11, width: 36, textAlign: 'right' }}>{c.pctOfOrders}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>{fmt(c.revenue)}</td>
                  <td style={{ padding: '10px 14px' }}>{fmt(c.avgSpend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
        <SectionTitle>Customer Directory</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: ROSE, color: '#fff' }}>
                {['Name','Email','City','State','Orders','Total Spend'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.customers.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: MUTED }}>No customers yet.</td></tr>
              )}
              {data.customers.map((c, i) => (
                <tr key={c.email} style={{ background: i % 2 === 0 ? '#fff' : BEIGE }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500 }}>{c.name || '—'}</td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: MUTED }}>{c.email}</td>
                  <td style={{ padding: '10px 14px' }}>{c.city}</td>
                  <td style={{ padding: '10px 14px' }}>{c.state}</td>
                  <td style={{ padding: '10px 14px' }}>{c.orderCount}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{fmt(c.totalSpend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Categories Tab ────────────────────────────────────────────────────────────
function CategoriesTab() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', slug: '', image: '', isActive: true, sortOrder: 0 });

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('zaybaash_admin_token') ?? '';
    const ts = localStorage.getItem('zaybaash_admin_ts') ?? '';
    return { 'x-admin-token': token, 'x-admin-ts': ts, 'Content-Type': 'application/json' };
  }, []);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', { headers: authHeaders(), cache: 'no-store' });
      const data = await res.json() as { categories?: CategoryRow[] };
      setCategories(data.categories ?? []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { void loadCategories(); }, [loadCategories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editing ? `/api/admin/categories/${editing.categoryId}` : '/api/admin/categories';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(formData) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to save category');
      }

      await loadCategories();
      setShowForm(false);
      setEditing(null);
      setFormData({ name: '', description: '', slug: '', image: '', isActive: true, sortOrder: 0 });
    } catch (err) {
      console.error('Failed to save category:', err);
      alert(err instanceof Error ? err.message : 'Failed to save category');
    }
  }

  async function handleDelete(categoryId: string) {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to delete category');
      }
      await loadCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    }
  }

  function startEdit(cat: CategoryRow) {
    setEditing(cat);
    setFormData({ name: cat.name, description: cat.description, slug: cat.slug, image: cat.image, isActive: cat.isActive, sortOrder: cat.sortOrder });
    setShowForm(true);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>{categories.length} categories</p>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ name: '', description: '', slug: '', image: '', isActive: true, sortOrder: 0 }); }}
          style={{ padding: '10px 16px', background: ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {loading && (
        <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>Loading categories...</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Category Name" required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="Slug"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none', gridColumn: '1 / -1' }} />
            <input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="Image URL"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} placeholder="Sort Order"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: BROWN, marginBottom: 16 }}>
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ accentColor: ROSE }} />
            Active
          </label>
          <button type="submit" style={{ padding: '10px 20px', background: ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {editing ? 'Update' : 'Create'} Category
          </button>
        </form>
      )}

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: ROSE, color: '#fff' }}>
              {['Name', 'Slug', 'Sort Order', 'Active', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: MUTED }}>No categories found.</td>
              </tr>
            )}
            {categories.map((c, i) => (
              <tr key={c.categoryId} style={{ background: i % 2 === 0 ? '#fff' : BEIGE }}>
                <td style={{ padding: '10px 14px', fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: MUTED }}>{c.slug}</td>
                <td style={{ padding: '10px 14px' }}>{c.sortOrder}</td>
                <td style={{ padding: '10px 14px' }}>{c.isActive ? '✓' : '✗'}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => startEdit(c)} style={{ padding: '6px 10px', background: '#6B5247', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(c.categoryId)} style={{ padding: '6px 10px', background: '#C0504D', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Products Tab ──────────────────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    originalPrice: 0,
    costPrice: 0,
    stock: 0,
    description: '',
    imageUrls: '',
    detailsText: '',
    sizesText: 'S, M, L',
    colorsText: 'Default:#E6B7A9',
    tagsText: '',
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: false,
    isBestseller: false,
  });

  function parseCsvOrLines(value: string): string[] {
    return value
      .split(/[\n,]/g)
      .map((v) => v.trim())
      .filter(Boolean);
  }

  function parseColors(value: string): Array<{ name: string; hex: string }> {
    const rows = parseCsvOrLines(value);
    const parsed = rows
      .map((row) => {
        const [namePart, hexPart] = row.split(':');
        const name = (namePart ?? '').trim();
        const hex = (hexPart ?? '').trim();
        if (!name || !hex) return null;
        return { name, hex };
      })
      .filter((c): c is { name: string; hex: string } => !!c);

    return parsed.length > 0 ? parsed : [{ name: 'Default', hex: '#E6B7A9' }];
  }

  function resetForm() {
    setFormData({
      name: '',
      category: '',
      price: 0,
      originalPrice: 0,
      costPrice: 0,
      stock: 0,
      description: '',
      imageUrls: '',
      detailsText: '',
      sizesText: 'S, M, L',
      colorsText: 'Default:#E6B7A9',
      tagsText: '',
      isActive: true,
      outOfStock: false,
      isNewArrival: false,
      isSale: false,
      isBestseller: false,
    });
    setUploadedImages([]);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files) return;
    
    setUploadingImage(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setUploadedImages((prev) => [...(prev ?? []), dataUrl]);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
    setUploadingImage(false);
    e.currentTarget.value = '';
  }

  function removeUploadedImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('zaybaash_admin_token') ?? '';
    const ts = localStorage.getItem('zaybaash_admin_ts') ?? '';
    return { 'x-admin-token': token, 'x-admin-ts': ts, 'Content-Type': 'application/json' };
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', { headers: authHeaders(), cache: 'no-store' });
      const data = await res.json() as { products?: ProductRow[] };
      setProducts(data.products ?? []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { void loadProducts(); }, [loadProducts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editing ? `/api/admin/products/${editing.productId}` : '/api/admin/products';
      const method = editing ? 'PUT' : 'POST';

      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price) || 0,
        originalPrice: Number(formData.originalPrice) || undefined,
        costPrice: Number(formData.costPrice) || 0,
        stock: Number(formData.stock) || 0,
        description: formData.description,
        images: uploadedImages.length > 0 ? uploadedImages : parseCsvOrLines(formData.imageUrls),
        details: parseCsvOrLines(formData.detailsText),
        sizes: parseCsvOrLines(formData.sizesText),
        colors: parseColors(formData.colorsText),
        tags: parseCsvOrLines(formData.tagsText),
        isActive: formData.isActive,
        outOfStock: formData.outOfStock,
        isNewArrival: formData.isNewArrival,
        isSale: formData.isSale,
        isBestseller: formData.isBestseller,
      };

      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to save product');
      }

      await loadProducts();
      setShowForm(false);
      setEditing(null);
      resetForm();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert(err instanceof Error ? err.message : 'Failed to save product');
    }
  }

  async function handleDelete(productId: string) {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE', headers: authHeaders() });
    void loadProducts();
  }

  async function quickSetStock(prod: ProductRow, nextStock: number, nextOutOfStock = prod.outOfStock) {
    const payload = {
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice,
      costPrice: prod.costPrice,
      stock: nextStock,
      description: prod.description,
      images: prod.images,
      details: prod.details,
      sizes: prod.sizes,
      colors: prod.colors,
      rating: prod.rating,
      reviewCount: prod.reviewCount,
      tags: prod.tags,
      isActive: prod.isActive,
      outOfStock: nextOutOfStock,
      isNewArrival: prod.isNewArrival,
      isSale: prod.isSale,
      isBestseller: prod.isBestseller,
    };
    await fetch(`/api/admin/products/${prod.productId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    void loadProducts();
  }

  function startEdit(prod: ProductRow) {
    setEditing(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      costPrice: prod.costPrice,
      stock: prod.stock,
      description: prod.description || '',
      imageUrls: (prod.images ?? []).join('\n'),
      detailsText: (prod.details ?? []).join('\n'),
      sizesText: (prod.sizes ?? []).join(', '),
      colorsText: (prod.colors ?? []).map((c) => `${c.name}:${c.hex}`).join(', '),
      tagsText: (prod.tags ?? []).join(', '),
      isActive: prod.isActive !== false,
      outOfStock: prod.outOfStock === true,
      isNewArrival: prod.isNewArrival,
      isSale: prod.isSale,
      isBestseller: prod.isBestseller,
    });
    setUploadedImages(prod.images ?? []);
    setShowForm(true);
  }

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= lowStockThreshold && p.isActive !== false).length;
  const outOfStockCount = products.filter((p) => p.outOfStock).length;
  const inactiveCount = products.filter((p) => p.isActive === false).length;
  const filteredProducts = showLowStockOnly
    ? products.filter((p) => p.stock > 0 && p.stock <= lowStockThreshold && p.isActive !== false)
    : products;

  async function activateAllInactive() {
    if (!confirm(`Activate all ${inactiveCount} hidden products? They will appear in the store.`)) return;
    try {
      const res = await fetch('/api/admin/activate-all', {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json() as { success?: boolean; message?: string };
      if (data.success) {
        alert(`✓ ${data.message}`);
        void loadProducts();
      }
    } catch (err) {
      alert('Failed to activate products');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>{products.length} products</p>
          <span style={{ fontSize: 12, color: '#A0613E', background: '#FDF3EC', border: '1px solid #F1D9C7', borderRadius: 999, padding: '4px 10px' }}>
            Low stock: {lowStockCount}
          </span>
          <span style={{ fontSize: 12, color: '#8A3A38', background: '#FDECEC', border: '1px solid #F3CACA', borderRadius: 999, padding: '4px 10px' }}>
            Out of stock: {outOfStockCount}
          </span>
          {inactiveCount > 0 && (
            <span style={{ fontSize: 12, color: '#6B5247', background: '#F5E8E0', border: '1px solid #E8D7C8', borderRadius: 999, padding: '4px 10px' }}>
              Hidden: {inactiveCount}
            </span>
          )}
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); resetForm(); }}
          style={{ padding: '10px 16px', background: ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 12, color: BROWN }}>Low-stock threshold</label>
        <input
          type="number"
          min={1}
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(Math.max(1, Number(e.target.value) || 1))}
          style={{ width: 80, padding: '8px 10px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 12, color: BROWN, background: '#fff' }}
        />
        <button
          onClick={() => setShowLowStockOnly((v) => !v)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #EBD9CC', background: showLowStockOnly ? '#FBEDE6' : '#fff', color: BROWN, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
        >
          {showLowStockOnly ? 'Showing Low Stock Only' : 'Show Low Stock Only'}
        </button>
        {inactiveCount > 0 && (
          <button
            onClick={activateAllInactive}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #3E7B4E', background: '#E8F5E9', color: '#2E5C3E', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
          >
            Activate All {inactiveCount} Hidden
          </button>
        )}
      </div>

      {loading && (
        <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>Loading products...</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product Name" required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none', gridColumn: '1 / -1' }} />
            <input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Category" required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="Price" required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })} placeholder="Original Price (optional)"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="number" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })} placeholder="Cost Price" required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} placeholder="Stock" required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none', gridColumn: '1 / -1', minHeight: 90 }} />
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: BROWN, marginBottom: 8, fontWeight: 600 }}>Product Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                style={{ display: 'block', width: '100%', padding: '8px 10px', border: '2px dashed #EBD9CC', borderRadius: 8, fontSize: 12, color: BROWN, background: CREAM, cursor: uploadingImage ? 'not-allowed' : 'pointer' }}
              />
              {uploadedImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10, marginTop: 12 }}>
                  {uploadedImages.map((img, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #EBD9CC' }}>
                      <img src={img} alt={`Product ${i}`} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(i)}
                        style={{ position: 'absolute', top: 4, right: 4, background: '#C0504D', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {uploadedImages.length === 0 && (
                <p style={{ fontSize: 12, color: MUTED, marginTop: 8 }}>No images uploaded. You can also paste image URLs below as fallback.</p>
              )}
            </div>
            <textarea value={formData.imageUrls} onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })} placeholder="Image URLs as fallback (one per line)"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none', minHeight: 60, gridColumn: '1 / -1' }} />
            <textarea value={formData.detailsText} onChange={(e) => setFormData({ ...formData, detailsText: e.target.value })} placeholder="Details (comma or line separated)"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none', minHeight: 90 }} />
            <input value={formData.sizesText} onChange={(e) => setFormData({ ...formData, sizesText: e.target.value })} placeholder="Sizes (e.g. XS,S,M,L)"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input value={formData.colorsText} onChange={(e) => setFormData({ ...formData, colorsText: e.target.value })} placeholder="Colors (e.g. Rose:#E6B7A9, Black:#1A1A1A)"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input value={formData.tagsText} onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })} placeholder="Tags (comma separated)"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none', gridColumn: '1 / -1' }} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: BROWN }}>
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ accentColor: ROSE }} />
              Active in Store
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: BROWN }}>
              <input type="checkbox" checked={formData.outOfStock} onChange={(e) => setFormData({ ...formData, outOfStock: e.target.checked })} style={{ accentColor: ROSE }} />
              Mark Out of Stock
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: BROWN }}>
              <input type="checkbox" checked={formData.isNewArrival} onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })} style={{ accentColor: ROSE }} />
              New Arrival
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: BROWN }}>
              <input type="checkbox" checked={formData.isSale} onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })} style={{ accentColor: ROSE }} />
              On Sale
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: BROWN }}>
              <input type="checkbox" checked={formData.isBestseller} onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })} style={{ accentColor: ROSE }} />
              Bestseller
            </label>
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {editing ? 'Update' : 'Create'} Product
          </button>
        </form>
      )}

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, overflow: 'hidden', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: ROSE, color: '#fff' }}>
              {['Name', 'Category', 'Price', 'Cost', 'Stock', 'Sold', 'Status', 'Tags', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && filteredProducts.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 24, textAlign: 'center', color: MUTED }}>No products found.</td>
              </tr>
            )}
            {filteredProducts.map((p, i) => (
              <tr key={p.productId} style={{ background: i % 2 === 0 ? '#fff' : BEIGE }}>
                <td style={{ padding: '10px 14px', fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '10px 14px' }}>{p.category}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{fmt(p.price)}</td>
                <td style={{ padding: '10px 14px' }}>{fmt(p.costPrice)}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{p.stock}</span>
                    {p.stock > 0 && p.stock <= lowStockThreshold && p.isActive !== false && (
                      <span style={{ fontSize: 10, color: '#A0613E', background: '#FDF3EC', border: '1px solid #F1D9C7', borderRadius: 999, padding: '2px 6px' }}>
                        LOW
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '10px 14px' }}>{p.sold}</td>
                <td style={{ padding: '10px 14px' }}>
                  {!p.isActive ? 'Hidden' : p.outOfStock ? 'Out of stock' : 'In stock'}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {p.isNewArrival && <span className="badge-new">New</span>}
                    {p.isSale && <span className="badge-sale">Sale</span>}
                    {p.isBestseller && <span style={{ background: '#6B8E6B', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>Best</span>}
                  </div>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {p.outOfStock ? (
                      <button onClick={() => void quickSetStock(p, Math.max(p.stock, lowStockThreshold, 1), false)} style={{ padding: '6px 10px', background: '#3E7B4E', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Restock</button>
                    ) : (
                      <button onClick={() => void quickSetStock(p, p.stock, true)} style={{ padding: '6px 10px', background: '#B37A3B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Mark OOS</button>
                    )}
                    <button onClick={() => startEdit(p)} style={{ padding: '6px 10px', background: '#6B5247', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(p.productId)} style={{ padding: '6px 10px', background: '#C0504D', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Coupons Tab ───────────────────────────────────────────────────────────────
function CouponsTab() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CouponRow | null>(null);
  const [formData, setFormData] = useState({ code: '', description: '', discountType: 'percentage' as 'percentage' | 'fixed', discountValue: 0, minOrderValue: 0, maxDiscountValue: 0, usageLimit: 0, startDate: '', endDate: '', isActive: true });

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('zaybaash_admin_token') ?? '';
    const ts = localStorage.getItem('zaybaash_admin_ts') ?? '';
    return { 'x-admin-token': token, 'x-admin-ts': ts, 'Content-Type': 'application/json' };
  }, []);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons', { headers: authHeaders(), cache: 'no-store' });
      const data = await res.json() as { coupons?: CouponRow[] };
      setCoupons(data.coupons ?? []);
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { void loadCoupons(); }, [loadCoupons]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editing ? `/api/admin/coupons/${editing._id}` : '/api/admin/coupons';
      const method = editing ? 'PUT' : 'POST';
      await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(formData) });
      setShowForm(false);
      setEditing(null);
      setFormData({ code: '', description: '', discountType: 'percentage', discountValue: 0, minOrderValue: 0, maxDiscountValue: 0, usageLimit: 0, startDate: '', endDate: '', isActive: true });
      void loadCoupons();
    } catch (err) {
      console.error('Failed to save coupon:', err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this coupon?')) return;
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE', headers: authHeaders() });
    void loadCoupons();
  }

  function startEdit(coupon: CouponRow) {
    setEditing(coupon);
    setFormData({ code: coupon.code, description: coupon.description, discountType: coupon.discountType, discountValue: coupon.discountValue, minOrderValue: coupon.minOrderValue, maxDiscountValue: coupon.maxDiscountValue, usageLimit: coupon.usageLimit, startDate: coupon.startDate.slice(0, 10), endDate: coupon.endDate.slice(0, 10), isActive: coupon.isActive });
    setShowForm(true);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>{coupons.length} coupons</p>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setFormData({ code: '', description: '', discountType: 'percentage', discountValue: 0, minOrderValue: 0, maxDiscountValue: 0, usageLimit: 0, startDate: '', endDate: '', isActive: true }); }}
          style={{ padding: '10px 16px', background: ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Add Coupon'}
        </button>
      </div>

      {loading && (
        <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>Loading coupons...</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="Coupon Code" required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: '#fff', outline: 'none' }}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (PKR)</option>
            </select>
            <input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })} placeholder="Discount Value" required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="number" value={formData.minOrderValue} onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })} placeholder="Min Order Value"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="number" value={formData.maxDiscountValue} onChange={(e) => setFormData({ ...formData, maxDiscountValue: Number(e.target.value) })} placeholder="Max Discount"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="number" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })} placeholder="Usage Limit (0=unlimited)"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
            <input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description"
              style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none', gridColumn: '1 / -1' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: BROWN, marginBottom: 16 }}>
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ accentColor: ROSE }} />
            Active
          </label>
          <button type="submit" style={{ padding: '10px 20px', background: ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {editing ? 'Update' : 'Create'} Coupon
          </button>
        </form>
      )}

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, overflow: 'hidden', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: ROSE, color: '#fff' }}>
              {['Code', 'Discount', 'Min Order', 'Used/Limit', 'Valid Until', 'Active', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && coupons.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: MUTED }}>No coupons found.</td>
              </tr>
            )}
            {coupons.map((c, i) => (
              <tr key={c._id} style={{ background: i % 2 === 0 ? '#fff' : BEIGE }}>
                <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 600 }}>{c.code}</td>
                <td style={{ padding: '10px 14px' }}>{c.discountType === 'percentage' ? `${c.discountValue}%` : fmt(c.discountValue)}</td>
                <td style={{ padding: '10px 14px' }}>{c.minOrderValue > 0 ? fmt(c.minOrderValue) : '—'}</td>
                <td style={{ padding: '10px 14px' }}>{c.usedCount}/{c.usageLimit || '∞'}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: MUTED }}>{new Date(c.endDate).toLocaleDateString()}</td>
                <td style={{ padding: '10px 14px' }}>{c.isActive ? '✓' : '✗'}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => startEdit(c)} style={{ padding: '6px 10px', background: '#6B5247', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(c._id)} style={{ padding: '6px 10px', background: '#C0504D', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Reviews Tab ───────────────────────────────────────────────────────────────
function ReviewsTab() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('zaybaash_admin_token') ?? '';
    const ts = localStorage.getItem('zaybaash_admin_ts') ?? '';
    return { 'x-admin-token': token, 'x-admin-ts': ts };
  }, []);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews', { headers: authHeaders(), cache: 'no-store' });
      const data = await res.json() as { reviews?: ReviewRow[] };
      setReviews(data.reviews ?? []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { void loadReviews(); }, [loadReviews]);

  async function toggleApproval(reviewId: string, isApproved: boolean) {
    await fetch(`/api/admin/reviews/${reviewId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ isApproved: !isApproved }),
    });
    void loadReviews();
  }

  async function handleDelete(reviewId: string) {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE', headers: authHeaders() });
    void loadReviews();
  }

  const filtered = reviews.filter((r) => {
    if (filter === 'approved') return r.isApproved;
    if (filter === 'pending') return !r.isApproved;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>{filtered.length} reviews</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '8px 14px', background: filter === f ? ROSE : '#fff', color: filter === f ? '#fff' : BROWN, border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>Loading reviews...</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((r) => (
          <div key={r.reviewId} style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: BROWN }}>{r.productName}</h4>
                <p style={{ margin: 0, fontSize: 12, color: MUTED }}>by {r.customerName} ({r.customerEmail}) · {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleApproval(r.reviewId, r.isApproved)}
                  style={{ padding: '6px 10px', background: r.isApproved ? '#6B8E6B' : '#F0C9BF', color: BROWN, border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
                  {r.isApproved ? 'Approved' : 'Approve'}
                </button>
                <button onClick={() => handleDelete(r.reviewId)}
                  style={{ padding: '6px 10px', background: '#C0504D', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < r.rating ? '#F59E0B' : '#EBD9CC', fontSize: 16 }}>★</span>
              ))}
              {r.isVerifiedPurchase && <span style={{ background: '#6B8E6B', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>Verified</span>}
            </div>
            {r.title && <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: BROWN }}>{r.title}</p>}
            <p style={{ margin: 0, fontSize: 13, color: BROWN, lineHeight: 1.5 }}>{r.comment}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: MUTED }}>No reviews found.</div>
        )}
      </div>
    </div>
  );
}

// ── Customers Tab ─────────────────────────────────────────────────────────────
function CustomersTab({ data }: { data: DashData }) {
  const [search, setSearch] = useState('');
  const filtered = data.customers.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.city.toLowerCase().includes(s);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or city…"
        style={{ padding: '10px 14px', border: '1px solid #EBD9CC', borderRadius: 8, fontSize: 13, color: BROWN, background: CREAM, outline: 'none' }} />
      <p style={{ margin: 0, fontSize: 12, color: MUTED }}>{filtered.length} customers</p>
      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, overflow: 'hidden', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: ROSE, color: '#fff' }}>
              {['Name', 'Email', 'City', 'State', 'Orders', 'Total Spend'].map((h) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.email} style={{ background: i % 2 === 0 ? '#fff' : BEIGE }}>
                <td style={{ padding: '10px 14px', fontWeight: 500 }}>{c.name || '—'}</td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: MUTED }}>{c.email}</td>
                <td style={{ padding: '10px 14px' }}>{c.city}</td>
                <td style={{ padding: '10px 14px' }}>{c.state}</td>
                <td style={{ padding: '10px 14px' }}>{c.orderCount}</td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{fmt(c.totalSpend)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: MUTED }}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Bank Proofs Tab ───────────────────────────────────────────────────────────
function BankProofsTab() {
  const [rows, setRows] = useState<BankProofRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const authHeaders = useCallback(() => {
    const token = localStorage.getItem('zaybaash_admin_token') ?? '';
    const ts = localStorage.getItem('zaybaash_admin_ts') ?? '';
    return { 'x-admin-token': token, 'x-admin-ts': ts };
  }, []);

  const load = useCallback(async () => {
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bank-proof/list', {
        cache: 'no-store',
        headers: { ...authHeaders(), 'Cache-Control': 'no-cache' },
      });
      const data = await res.json() as { orders?: BankProofRow[]; error?: string };
      if (!res.ok) { setErr(data.error ?? 'Failed to load'); return; }
      setRows(data.orders ?? []);
    } catch {
      setErr('Failed to load');
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { void load(); }, [load]);

  async function approve(orderId: string) {
    const res = await fetch('/api/admin/bank-proof/approve', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    if (res.ok) void load();
  }

  async function reject(orderId: string) {
    const res = await fetch('/api/admin/bank-proof/reject', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    if (res.ok) void load();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ margin: 0, color: MUTED, fontSize: 12 }}>
          Pending proofs: {rows.length}
        </p>
        <button
          onClick={() => load()}
          disabled={loading}
          style={{
            padding: '10px 14px',
            background: loading ? MUTED : ROSE,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {err && (
        <div style={{ padding: 12, borderRadius: 10, background: '#fff', border: '1px solid #EBD9CC', color: '#C0504D' }}>
          {err}
        </div>
      )}

      <div style={{ background: '#fff', border: '1px solid #EBD9CC', borderRadius: 12, padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: ROSE, color: '#fff' }}>
                {['Order ID', 'Placed', 'Customer', 'City', 'Total', 'Transaction ID', 'Proof', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 28, textAlign: 'center', color: MUTED }}>
                    No pending bank transfer proofs.
                  </td>
                </tr>
              )}
              {rows.map((o, i) => {
                const name = `${o.customer?.firstName ?? ''} ${o.customer?.lastName ?? ''}`.trim() || '—';
                const proofUrl = o.bankTransfer?.proofUrl ?? '';
                const placed = o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 19).replace('T', ' ') : '—';
                return (
                  <tr key={o.orderId} style={{ background: i % 2 === 0 ? '#fff' : BEIGE }}>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12 }}>{o.orderId}</td>
                    <td style={{ padding: '10px 14px', color: MUTED, fontSize: 12 }}>{placed}</td>
                    <td style={{ padding: '10px 14px' }}>{name}</td>
                    <td style={{ padding: '10px 14px' }}>{o.customer?.city ?? '—'}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{fmt(o.total)}</td>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12 }}>{o.bankTransfer?.transactionId ?? '—'}</td>
                    <td style={{ padding: '10px 14px' }}>
                      {proofUrl ? (
                        <a href={proofUrl} target="_blank" rel="noreferrer" style={{ color: ROSE, fontWeight: 600 }}>
                          View
                        </a>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => approve(o.orderId)}
                          style={{ padding: '6px 10px', background: '#6B8E6B', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reject(o.orderId)}
                          style={{ padding: '6px 10px', background: '#C0504D', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [authed,  setAuthed]  = useState<boolean | null>(null); // null = checking
  const [tab,     setTab]     = useState('overview');
  const [data,    setData]    = useState<DashData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRef, setLastRef] = useState('');
  const [liveOn, setLiveOn]   = useState(true);
  const [error, setError]     = useState('');

  const verify = useCallback(async () => {
    const token = localStorage.getItem('zaybaash_admin_token');
    const ts    = localStorage.getItem('zaybaash_admin_ts');
    if (!token || !ts) { setAuthed(false); return; }
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ts: Number(ts) }),
      });
      const d = await res.json() as { valid: boolean };
      setAuthed(d.valid);
      if (!d.valid) { localStorage.removeItem('zaybaash_admin_token'); localStorage.removeItem('zaybaash_admin_ts'); }
    } catch { setAuthed(false); }
  }, []);

  const fetchData = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent === true;
    if (!silent) {
      setLoading(true);
      setError('');
    }
    try {
      const token = localStorage.getItem('zaybaash_admin_token') ?? '';
      const ts    = localStorage.getItem('zaybaash_admin_ts') ?? '';
      const res = await fetch('/api/powerbi', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'x-admin-token': token,
          'x-admin-ts': ts,
        },
      });
      const d = await res.json() as DashData & { error?: string };
      if (!res.ok) {
        const errMsg = d.error || `HTTP ${res.status}: Failed to fetch data`;
        console.error('Dashboard fetch error:', errMsg);
        if (!silent) setError(errMsg);
        return;
      }
      if (d.error) {
        console.error('Dashboard data error:', d.error);
        if (!silent) setError(d.error);
        return;
      }
      setData(d as DashData);
      setLastRef(new Date().toLocaleTimeString());
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Dashboard fetch exception:', err);
      if (!silent) setError(`Failed to load: ${errMsg}`);
    }
    finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { verify(); }, [verify]);
  useEffect(() => { if (authed) fetchData(); }, [authed, fetchData]);

  // Live updates: poll MongoDB on an interval; pause when tab is in background
  useEffect(() => {
    if (!authed || !liveOn) return;

    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      void fetchData({ silent: true });
    }, POLL_MS);

    const onVisible = () => {
      if (document.visibilityState === 'visible') void fetchData({ silent: true });
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [authed, liveOn, fetchData]);

  function handleLock() {
    localStorage.removeItem('zaybaash_admin_token');
    localStorage.removeItem('zaybaash_admin_ts');
    setAuthed(false);
    setData(null);
  }

  if (authed === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: CREAM }}>
        <p style={{ color: MUTED, fontSize: 14 }}>Checking session…</p>
      </div>
    );
  }

  if (!authed) return <LoginWall onLogin={() => { setAuthed(true); }} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: CREAM }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: BROWN, color: '#fff', display: 'flex',
        flexDirection: 'column', padding: '28px 0', position: 'fixed', left: 0, top: 0,
        height: '100vh', flexShrink: 0, zIndex: 100, overflowY: 'auto',
      }}>
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '0.04em' }}>ZAYBAASH</p>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9A7B72', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Dashboard</p>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '12px 20px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: tab === t.id ? 'rgba(183,110,121,.25)' : 'transparent',
                color: tab === t.id ? '#F0C9BF' : 'rgba(255,255,255,.7)',
                borderLeft: tab === t.id ? `3px solid ${ROSE}` : '3px solid transparent',
                transition: 'all .15s',
              }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <button onClick={handleLock}
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
            🔒 Lock Dashboard
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 220, padding: '32px 36px', overflowY: 'auto', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: BROWN }}>
              {TABS.find((t) => t.id === tab)?.label}
            </h1>
            {lastRef && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: MUTED }}>
                Last updated: {lastRef}
                {liveOn ? ` · Auto-refresh every ${Math.round(POLL_MS / 1000)}s (while tab is visible)` : ' · Auto-refresh off'}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: MUTED, cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={liveOn}
                onChange={(e) => setLiveOn(e.target.checked)}
                style={{ accentColor: ROSE }}
              />
              Live ({Math.round(POLL_MS / 1000)}s)
            </label>
            {liveOn && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontWeight: 600, color: '#fff', background: '#6B8E6B',
                padding: '4px 10px', borderRadius: 20,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#fff',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }} />
                Active
              </span>
            )}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }`}</style>
            <button type="button" onClick={() => fetchData()} disabled={loading}
              style={{
                padding: '10px 20px', background: loading ? MUTED : ROSE, color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}>
              {loading ? '⟳ Loading…' : '⟳ Refresh now'}
            </button>
          </div>
        </div>

        {/* Tab content */}
        {!data ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 16 }}>
            {loading ? (
              <>
                <div style={{ width: 40, height: 40, border: '4px solid #EBD9CC', borderTop: `4px solid ${ROSE}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <p style={{ color: MUTED, fontSize: 14 }}>Loading dashboard data…</p>
              </>
            ) : error ? (
              <>
                <div style={{ padding: 24, background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: 12, maxWidth: 500, textAlign: 'center' }}>
                  <p style={{ color: '#C0504D', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>⚠️ Error Loading Data</p>
                  <p style={{ color: '#C0504D', fontSize: 13, marginBottom: 16 }}>{error}</p>
                  <button
                    onClick={() => fetchData()}
                    style={{ padding: '10px 20px', background: ROSE, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Try Again
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: MUTED, fontSize: 14 }}>No data loaded</p>
            )}
          </div>
        ) : (
          <>
            {tab === 'overview'   && <OverviewTab   data={data} />}
            {tab === 'sales'      && <SalesTab      data={data} />}
            {tab === 'orders'     && <OrdersTab     data={data} fetchData={() => fetchData()} />}
            {tab === 'products'   && <ProductsTab />}
            {tab === 'categories' && <CategoriesTab />}
            {tab === 'inventory'  && <InventoryTab  data={data} />}
            {tab === 'customers'  && <CustomersTab  data={data} />}
            {tab === 'coupons'    && <CouponsTab />}
            {tab === 'reviews'    && <ReviewsTab />}
            {tab === 'finance'    && <FinanceTab    data={data} />}
            {tab === 'locations'  && <LocationsTab  data={data} />}
            {tab === 'bankProofs' && <BankProofsTab />}
          </>
        )}
      </main>
    </div>
  );
}
