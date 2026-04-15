import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/adminAuth';
import { generateVirtualThreads3DMockup, hasVirtualThreadsConfig } from '@/lib/virtualthreads';

function findProductQuery(id: string) {
  const normalizedId = String(id ?? '').trim();
  if (mongoose.Types.ObjectId.isValid(normalizedId)) {
    return {
      $or: [
        { productId: normalizedId },
        { _id: new mongoose.Types.ObjectId(normalizedId) },
      ],
    };
  }
  return { productId: normalizedId };
}

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    if (!hasVirtualThreadsConfig()) {
      return NextResponse.json({ error: 'VirtualThreads API is not configured' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({})) as { productId?: string };
    const productId = String(body.productId ?? '').trim();
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findOne(findProductQuery(productId));
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const frontImageUrl = String(product.frontImageUrl ?? product.images?.[0] ?? '').trim();
    const backImageUrl = String(product.backImageUrl ?? product.images?.[1] ?? '').trim();

    if (!frontImageUrl || !backImageUrl) {
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            model3dStatus: 'failed',
            model3dError: 'Both front and back images are required',
            model3dUpdatedAt: new Date(),
          },
        },
      );
      return NextResponse.json({ error: 'Both front and back images are required' }, { status: 400 });
    }

    await Product.updateOne(
      { _id: product._id },
      { $set: { model3dStatus: 'pending', model3dError: '', model3dUpdatedAt: new Date() } },
    );

    const generated = await generateVirtualThreads3DMockup({
      frontImageUrl,
      backImageUrl,
      productId: product.productId,
      name: product.name,
      category: product.category,
    });

    if (!generated.success || !generated.modelUrl) {
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            model3dStatus: 'failed',
            model3dError: generated.error || 'Could not generate 3D model',
            model3dUpdatedAt: new Date(),
          },
        },
      );
      return NextResponse.json({ error: generated.error || 'Could not generate 3D model' }, { status: 400 });
    }

    await Product.updateOne(
      { _id: product._id },
      {
        $set: {
          model3dUrl: generated.modelUrl,
          model3dStatus: 'ready',
          model3dError: '',
          model3dUpdatedAt: new Date(),
        },
      },
    );

    const fresh = await Product.findById(product._id).lean();
    return NextResponse.json({ success: true, product: fresh });
  } catch (err) {
    console.error('POST /api/admin/products/generate-3d error:', err);
    return NextResponse.json({ error: 'Failed to generate 3D model' }, { status: 500 });
  }
}
