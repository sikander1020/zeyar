'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, Suspense } from 'react';
import * as fbq from '@/lib/fpixel';

function FacebookPixelInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Initial page load is already tracked by the script in layout.tsx <head>
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    fbq.pageview();
  }, [pathname, searchParams]);

  return null;
}

export default function FacebookPixel() {
  return (
    <Suspense fallback={null}>
      <FacebookPixelInner />
    </Suspense>
  );
}
