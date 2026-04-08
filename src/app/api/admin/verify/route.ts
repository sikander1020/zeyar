import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function makeToken(ts: number, secret: string): string {
  return createHash('sha256')
    .update(`${ts}:${secret}`)
    .digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { token, ts } = await req.json() as { token?: string; ts?: number };

    if (!token || !ts) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    if (Date.now() - ts > SESSION_TTL_MS) {
      return NextResponse.json({ valid: false, reason: 'expired' }, { status: 401 });
    }

    const secret = (process.env.ADMIN_TOKEN_SECRET ?? '').trim();
    if (!secret) {
      return NextResponse.json({ valid: false }, { status: 500 });
    }

    const expected = makeToken(ts, secret);
    if (token !== expected) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
