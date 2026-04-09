import { NextRequest } from 'next/server';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function getClientIp(req: NextRequest): string {
  const xf = req.headers.get('x-forwarded-for') ?? '';
  const first = xf.split(',')[0]?.trim();
  return first || 'unknown';
}

/**
 * Best-effort in-memory rate limiter (serverless-safe enough for basic throttling).
 * Returns null when allowed, or a string error code when blocked.
 */
export function rateLimit(req: NextRequest, key: string, opts: { windowMs: number; max: number }): string | null {
  const ip = getClientIp(req);
  const now = Date.now();
  const k = `${key}:${ip}`;
  const cur = buckets.get(k);
  if (!cur || cur.resetAt <= now) {
    buckets.set(k, { count: 1, resetAt: now + opts.windowMs });
    return null;
  }
  if (cur.count >= opts.max) return 'RATE_LIMITED';
  cur.count += 1;
  return null;
}

