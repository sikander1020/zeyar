/* ─────────────────────────────────────────────────────────────────────────────
 * TikTok Pixel — Client-side event utility
 * All PII (email, phone, external_id) is hashed with SHA-256 before sending.
 * ─────────────────────────────────────────────────────────────────────────────*/

declare global {
  interface Window {
    ttq: any;
  }
}

const CURRENCY = 'PKR';

// ── SHA-256 hashing (browser SubtleCrypto API) ───────────────────────────────
async function sha256(value: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) return '';
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Safe ttq access ──────────────────────────────────────────────────────────
function ttq() {
  if (typeof window !== 'undefined' && window.ttq) return window.ttq;
  return null;
}

// ── Identify visitor with hashed PII ─────────────────────────────────────────
export async function ttqIdentify(params: {
  email?: string;
  phone?: string;
  externalId?: string;
}) {
  const q = ttq();
  if (!q) return;

  const [hashedEmail, hashedPhone, hashedExternal] = await Promise.all([
    params.email ? sha256(params.email) : Promise.resolve(''),
    params.phone ? sha256(params.phone) : Promise.resolve(''),
    params.externalId ? sha256(params.externalId) : Promise.resolve(''),
  ]);

  q.identify({
    ...(hashedEmail && { email: hashedEmail }),
    ...(hashedPhone && { phone_number: hashedPhone }),
    ...(hashedExternal && { external_id: hashedExternal }),
  });
}

// ── Content helper type ───────────────────────────────────────────────────────
interface TikTokContent {
  content_id: string;
  content_type: 'product' | 'product_group';
  content_name: string;
}

// ── ViewContent ───────────────────────────────────────────────────────────────
export function ttqViewContent(product: {
  id: string;
  name: string;
  price: number;
}) {
  const q = ttq();
  if (!q) return;
  const content: TikTokContent = {
    content_id: product.id,
    content_type: 'product',
    content_name: product.name,
  };
  q.track('ViewContent', {
    contents: [content],
    value: product.price,
    currency: CURRENCY,
  });
}

// ── AddToWishlist ─────────────────────────────────────────────────────────────
export function ttqAddToWishlist(product: {
  id: string;
  name: string;
  price: number;
}) {
  const q = ttq();
  if (!q) return;
  q.track('AddToWishlist', {
    contents: [{ content_id: product.id, content_type: 'product', content_name: product.name }],
    value: product.price,
    currency: CURRENCY,
  });
}

// ── Search ────────────────────────────────────────────────────────────────────
export function ttqSearch(searchString: string) {
  const q = ttq();
  if (!q) return;
  q.track('Search', {
    contents: [],
    value: 0,
    currency: CURRENCY,
    search_string: searchString,
  });
}

// ── AddToCart ─────────────────────────────────────────────────────────────────
export function ttqAddToCart(product: {
  id: string;
  name: string;
  price: number;
}) {
  const q = ttq();
  if (!q) return;
  q.track('AddToCart', {
    contents: [{ content_id: product.id, content_type: 'product', content_name: product.name }],
    value: product.price,
    currency: CURRENCY,
  });
}

// ── InitiateCheckout ──────────────────────────────────────────────────────────
export function ttqInitiateCheckout(items: Array<{ id: string; name: string; price: number; quantity: number }>) {
  const q = ttq();
  if (!q) return;
  const value = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  q.track('InitiateCheckout', {
    contents: items.map((i) => ({ content_id: i.id, content_type: 'product', content_name: i.name })),
    value,
    currency: CURRENCY,
  });
}

// ── AddPaymentInfo ────────────────────────────────────────────────────────────
export function ttqAddPaymentInfo(items: Array<{ id: string; name: string; price: number; quantity: number }>) {
  const q = ttq();
  if (!q) return;
  const value = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  q.track('AddPaymentInfo', {
    contents: items.map((i) => ({ content_id: i.id, content_type: 'product', content_name: i.name })),
    value,
    currency: CURRENCY,
  });
}

// ── PlaceAnOrder ──────────────────────────────────────────────────────────────
export function ttqPlaceAnOrder(items: Array<{ id: string; name: string; price: number; quantity: number }>, total: number) {
  const q = ttq();
  if (!q) return;
  q.track('PlaceAnOrder', {
    contents: items.map((i) => ({ content_id: i.id, content_type: 'product', content_name: i.name })),
    value: total,
    currency: CURRENCY,
  });
}

// ── Purchase ──────────────────────────────────────────────────────────────────
export function ttqPurchase(items: Array<{ id: string; name: string; price: number; quantity: number }>, total: number) {
  const q = ttq();
  if (!q) return;
  q.track('Purchase', {
    contents: items.map((i) => ({ content_id: i.id, content_type: 'product', content_name: i.name })),
    value: total,
    currency: CURRENCY,
  });
}

// ── CompleteRegistration ──────────────────────────────────────────────────────
export function ttqCompleteRegistration() {
  const q = ttq();
  if (!q) return;
  q.track('CompleteRegistration', {
    contents: [],
    value: 0,
    currency: CURRENCY,
  });
}
