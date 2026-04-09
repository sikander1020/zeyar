import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function makeToken(ts: number, secret: string): string {
  return createHash('sha256')
    .update(`${ts}:${secret}`)
    .digest('hex');
}

function getAdminHeaders(req: NextRequest): { token: string; ts: number } {
  const token = (req.headers.get('x-admin-token') ?? '').trim();
  const tsRaw = (req.headers.get('x-admin-ts') ?? '').trim();
  return { token, ts: Number(tsRaw) };
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  const { token, ts } = getAdminHeaders(req);
  if (!token || !ts) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (Date.now() - ts > SESSION_TTL_MS) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = (process.env.ADMIN_TOKEN_SECRET ?? '').trim();
  if (!secret) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const expected = makeToken(ts, secret);
  if (token !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

