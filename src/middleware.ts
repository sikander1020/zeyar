import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zaybaash.com';

/** Send production *.vercel.app traffic to the custom domain (same path + query). */
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/'],
};
