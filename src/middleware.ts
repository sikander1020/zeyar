import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SITE_ORIGIN } from '@/lib/siteUrl';

/** Production-only: legacy domains/apex/vercel preview → canonical origin. */
export function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.next();
  }

  const host = request.headers.get('host') ?? '';

  if (host === 'zeyar.me' || host === 'www.zeyar.me') {
    const url = request.nextUrl.clone();
    url.hostname = 'www.zaybaash.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  if (host === 'zaybaash.com') {
    const url = request.nextUrl.clone();
    url.hostname = 'www.zaybaash.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  if (!host.endsWith('.vercel.app')) {
    return NextResponse.next();
  }

  try {
    const base = new URL(SITE_ORIGIN);
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, base);
    return NextResponse.redirect(target, 308);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/'],
};
