import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '@/lib/adminAuth';

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME ?? '').trim(),
  api_key: (process.env.CLOUDINARY_API_KEY ?? '').trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET ?? '').trim(),
});

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

function getResourceType(fileType: string) {
  return fileType.startsWith('video/') ? 'video' : 'image';
}

export async function POST(req: NextRequest) {
  try {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'File must be an image or video' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
    }

    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME ?? '').trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY ?? '').trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET ?? '').trim();
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    const resourceType = getResourceType(file.type);
    const ext = file.type.includes('webp') ? 'webp' : file.type.includes('png') ? 'png' : file.type.includes('gif') ? 'gif' : file.type.includes('quicktime') ? 'mov' : file.type.startsWith('video/') ? 'mp4' : 'jpg';
    const uploaded = await cloudinary.uploader.upload(dataUrl, {
      folder: 'zaybaash/admin-uploads',
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')}.${ext}`,
      overwrite: true,
    });

    return NextResponse.json({ 
      success: true, 
      url: uploaded.secure_url,
      fileName: file.name,
      type: file.type,
      size: file.size,
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
