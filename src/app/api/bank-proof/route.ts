import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { rateLimit } from '@/lib/rateLimit';

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME ?? '').trim(),
  api_key: (process.env.CLOUDINARY_API_KEY ?? '').trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET ?? '').trim(),
});

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function uploadToCloudinary(opts: { orderId: string; bytes: Buffer; contentType: string }) {
  const ext = opts.contentType === 'image/png' ? 'png' : opts.contentType === 'image/webp' ? 'webp' : 'jpg';
  const dataUri = `data:${opts.contentType};base64,${opts.bytes.toString('base64')}`;
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: 'zeyar/bank-proofs',
    public_id: `${opts.orderId}-${Date.now()}.${ext}`,
    resource_type: 'image',
    overwrite: true,
  });
  return res.secure_url as string;
}

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'bank-proof', { windowMs: 60_000, max: 10 });
    if (rl) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    await connectDB();

    const form = await req.formData();
    const orderId = String(form.get('orderId') ?? '').trim();
    const token = String(form.get('token') ?? '').trim();
    const transactionId = String(form.get('transactionId') ?? '').trim();
    const file = form.get('file');

    if (!orderId || !token || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Next.js File object
    const f = file as File;
    if (!ALLOWED_TYPES.has(f.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 415 });
    }
    if (f.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413 });
    }

    const order = await Order.findOne({ orderId }).select('paymentMethod paymentStatus bankTransfer customer total').lean();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (order.paymentMethod !== 'bank') {
      return NextResponse.json({ error: 'This order is not bank transfer' }, { status: 400 });
    }

    if (order.paymentStatus !== 'unpaid') {
      return NextResponse.json({ error: 'This order is already marked paid' }, { status: 409 });
    }

    const expectedToken = (order.bankTransfer?.uploadToken ?? '').trim();
    if (!expectedToken || token !== expectedToken) {
      return NextResponse.json({ error: 'Invalid upload token' }, { status: 401 });
    }

    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME ?? '').trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY ?? '').trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET ?? '').trim();
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const buf = Buffer.from(await f.arrayBuffer());
    const proofUrl = await uploadToCloudinary({ orderId, bytes: buf, contentType: f.type });

    await Order.updateOne(
      { orderId },
      {
        $set: {
          'bankTransfer.transactionId': transactionId,
          'bankTransfer.proofUrl': proofUrl,
          'bankTransfer.submittedAt': new Date(),
          'bankTransfer.status': 'proof_submitted',
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('POST /api/bank-proof error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

