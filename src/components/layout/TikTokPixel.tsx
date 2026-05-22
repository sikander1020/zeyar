'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';

/**
 * TikTokPixelInner — fires ttq.page() on every Next.js client-side route change.
 * The initial ttq.page() is already called by the base pixel script in layout.tsx <head>.
 * This component handles subsequent SPA navigations so TikTok's funnel stays intact.
 */
function TikTokPixelInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Skip first render — the base script already called ttq.page() on initial load
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.page();
    }
  }, [pathname, searchParams]);

  return null;
}

export default function TikTokPixel() {
  return (
    <Suspense fallback={null}>
      <TikTokPixelInner />
    </Suspense>
  );
}
