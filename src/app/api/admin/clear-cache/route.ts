import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, message: 'Cache successfully cleared!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
