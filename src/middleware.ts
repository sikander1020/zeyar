import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SITE_ORIGIN } from '@/lib/siteUrl';

/** Production-only: legacy domains/apex/vercel preview → canonical origin. */
export function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.next();
  }

  const hostHeader = request.headers.get('host') ?? '';
  const host = hostHeader.split(':')[0].toLowerCase();
  const isLegacyDomain = host === 'zeyar.me' || host === 'www.zeyar.me' || host === 'zaybaash.com';
  const isVercelPreview = host.endsWith('.vercel.app');
  const needsHttpsOnCanonical = host === 'www.zaybaash.com' && request.nextUrl.protocol !== 'https:';

  if (!isLegacyDomain && !isVercelPreview && !needsHttpsOnCanonical) {
    return NextResponse.next();
  }

  try {
    const base = new URL(SITE_ORIGIN);
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, base);
    return NextResponse.redirect(target, 301);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/'],
};
