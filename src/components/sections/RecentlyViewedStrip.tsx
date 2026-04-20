'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { StoreProduct } from '@/types/storefront';

const STORAGE_KEY = 'zaybaash-recently-viewed-v1';

export default function RecentlyViewedStrip({ products }: { products: StoreProduct[] }) {
  const [ids] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
    } catch {
      return [];
    }
  });

  const items = useMemo(() => {
    if (ids.length === 0) return [] as StoreProduct[];
    const byId = new Map(products.map((p) => [p.id, p]));
    return ids
      .map((id) => byId.get(id))
      .filter((p): p is StoreProduct => Boolean(p))
      .slice(0, 4);
  }, [ids, products]);

  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-3xl font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>
          Recently <span className="italic gradient-rose-text">Viewed</span>
        </h2>
        <Link href="/dresses" className="text-xs tracking-[0.15em] uppercase text-brown-muted hover:text-brown transition-colors">
          Continue Browsing
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="group product-card">
            <div className="relative aspect-[3/4] overflow-hidden bg-beige mb-3">
              <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <h3 className="text-sm font-playfair text-brown" style={{ fontFamily: "'Playfair Display', serif" }}>{p.name}</h3>
            <p className="text-sm text-brown-muted font-inter mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>Rs {p.price.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
