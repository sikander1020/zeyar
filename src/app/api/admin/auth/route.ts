import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH as string;
const TOKEN_SECRET  = process.env.ADMIN_TOKEN_SECRET  as string;

function makeToken(ts: number): string {
  return createHash('sha256')
    .update(`${ts}:${TOKEN_SECRET}`)
    .digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json() as { password?: string };
    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const submitted = createHash('sha256').update(password).digest('hex');

    if (submitted !== PASSWORD_HASH) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const ts    = Date.now();
    const token = makeToken(ts);
    return NextResponse.json({ token, ts });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


