import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

function envTrim(v: string | undefined): string {
  return (v ?? '').trim();
}

function makeToken(ts: number, secret: string): string {
  return createHash('sha256')
    .update(`${ts}:${secret}`)
    .digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json() as { password?: string };
    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const expectedHash = envTrim(process.env.ADMIN_PASSWORD_HASH);
    const tokenSecret  = envTrim(process.env.ADMIN_TOKEN_SECRET);
    if (!expectedHash || !tokenSecret) {
      console.error('ADMIN_PASSWORD_HASH or ADMIN_TOKEN_SECRET is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const submitted = createHash('sha256').update(password.trim(), 'utf8').digest('hex');

    if (submitted !== expectedHash) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const ts    = Date.now();
    const token = makeToken(ts, tokenSecret);
    return NextResponse.json({ token, ts });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


