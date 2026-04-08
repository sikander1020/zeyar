import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Canonical public URL (your custom domain on Vercel). */
const CANONICAL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zeyar.me';

/**
 * Vercel always assigns a *.vercel.app hostname. Once zeyar.me is added in
 * Vercel → Domains, this redirects production traffic from the default host
 * to your branded URL so /dashboard etc. show as zeyar.me/dashboard.
 */
export function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.next();
  }

  const host = request.headers.get('host') ?? '';
  if (!host.endsWith('.vercel.app')) {
    return NextResponse.next();
  }

  try {
    const base = new URL(CANONICAL);
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, base);
    return NextResponse.redirect(target, 308);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  // Skip static assets (they load from the same host after HTML redirect)
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/'],
};
