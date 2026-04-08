import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const TOKEN_SECRET   = process.env.ADMIN_TOKEN_SECRET as string;
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function makeToken(ts: number): string {
  return createHash('sha256')
    .update(`${ts}:${TOKEN_SECRET}`)
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

    const expected = makeToken(ts);
    if (token !== expected) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
