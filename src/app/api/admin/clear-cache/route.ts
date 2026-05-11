import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    revalidateTag('storefront-categories', 'max');
    revalidateTag('storefront-products', 'max');
    return NextResponse.json({ success: true, message: 'Cache successfully cleared!' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
