import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return NextResponse.json({ error: 'MONGODB_URI not set' }, { status: 500 });

  try {
    await connectDB();
    return NextResponse.json({ status: 'connected', db: 'zaybaash' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}