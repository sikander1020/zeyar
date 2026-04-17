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
const UPLOAD_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadToCloudinary(opts: { orderId: string; bytes: Buffer; contentType: string }) {
  const ext = opts.contentType === 'image/png' ? 'png' : opts.contentType === 'image/webp' ? 'webp' : 'jpg';
  const dataUri = `data:${opts.contentType};base64,${opts.bytes.toString('base64')}`;
  
  let lastErr: Error | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const uploadPromise = cloudinary.uploader.upload(dataUri, {
        folder: 'zaybaash/bank-proofs',
        public_id: `${opts.orderId}-${Date.now()}.${ext}`,
        resource_type: 'image',
        overwrite: true,
        timeout: UPLOAD_TIMEOUT,
      });
      
      const res = await Promise.race([
        uploadPromise,
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Cloudinary upload timeout')), UPLOAD_TIMEOUT)
        ),
      ]);
      
      return res.secure_url as string;
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      console.error(`Cloudinary upload attempt ${attempt}/${MAX_RETRIES} failed:`, lastErr.message);
      
      if (attempt < MAX_RETRIES) {
        // Exponential backoff: 1s, 2s, 4s
        await sleep(Math.pow(2, attempt - 1) * 1000);
      }
    }
  }
  
  throw lastErr || new Error('Cloudinary upload failed after retries');
}

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(req, 'bank-proof', { windowMs: 60_000, max: 10 });
    if (rl) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    // Validate environment variables
    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME ?? '').trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY ?? '').trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET ?? '').trim();
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('POST /api/bank-proof error: Missing Cloudinary credentials');
      return NextResponse.json({ error: 'Server configuration error - contact support' }, { status: 500 });
    }

    // Connect to DB with retry
    let dbConnected = false;
    let dbErr: Error | null = null;
    for (let i = 0; i < 2; i++) {
      try {
        await connectDB();
        dbConnected = true;
        break;
      } catch (err) {
        dbErr = err instanceof Error ? err : new Error(String(err));
        console.error(`DB connection attempt ${i + 1} failed:`, dbErr.message);
        if (i < 1) await sleep(1000);
      }
    }
    
    if (!dbConnected) {
      console.error('POST /api/bank-proof error: DB connection failed', dbErr);
      return NextResponse.json({ error: 'Database connection failed - please try again' }, { status: 503 });
    }

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
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, or WebP' }, { status: 415 });
    }
    if (f.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413 });
    }

    const order = await Order.findOne({ orderId }).select('paymentMethod paymentStatus bankTransfer customer total').lean();
    if (!order) {
      console.warn(`Bank proof order not found: ${orderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentMethod !== 'bank') {
      console.warn(`Bank proof for non-bank order: ${orderId}`);
      return NextResponse.json({ error: 'This order is not bank transfer' }, { status: 400 });
    }

    if (order.paymentStatus !== 'unpaid') {
      console.warn(`Bank proof for paid order: ${orderId}`);
      return NextResponse.json({ error: 'This order is already marked paid' }, { status: 409 });
    }

    const expectedToken = (order.bankTransfer?.uploadToken ?? '').trim();
    if (!expectedToken || token !== expectedToken) {
      console.warn(`Invalid bank proof token for order: ${orderId}`);
      return NextResponse.json({ error: 'Invalid upload token' }, { status: 401 });
    }

    // Upload file to Cloudinary
    let proofUrl: string;
    try {
      const buf = Buffer.from(await f.arrayBuffer());
      proofUrl = await uploadToCloudinary({ orderId, bytes: buf, contentType: f.type });
      console.log(`Bank proof uploaded for order ${orderId}: ${proofUrl}`);
    } catch (cloudErr) {
      const errMsg = cloudErr instanceof Error ? cloudErr.message : String(cloudErr);
      console.error(`Cloudinary upload failed for order ${orderId}:`, errMsg);
      return NextResponse.json({ error: 'Upload to server failed - please try again' }, { status: 502 });
    }

    // Update order
    try {
      const res = await Order.updateOne(
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
      
      if (res.matchedCount === 0) {
        console.error(`Order update failed - order not found: ${orderId}`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      
      console.log(`Bank proof submitted for order ${orderId}`);
    } catch (updateErr) {
      const errMsg = updateErr instanceof Error ? updateErr.message : String(updateErr);
      console.error(`Order update failed for ${orderId}:`, errMsg);
      return NextResponse.json({ error: 'Failed to save payment proof - please try again' }, { status: 503 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errStack = err instanceof Error ? err.stack : '';
    console.error('POST /api/bank-proof unexpected error:', { message: errMsg, stack: errStack });
    return NextResponse.json({ error: 'An unexpected error occurred - please try again' }, { status: 500 });
  }
}

