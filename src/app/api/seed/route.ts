import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

// Cost price = roughly 45% of selling price (typical fashion margin)
const COST_RATIO = 0.45;

const seedProducts = [
  { productId: 'zaybaash-001', name: 'Velvet Reverie Gown',          category: 'Dresses', price: 28900, originalPrice: 38000 },
  { productId: 'zaybaash-002', name: 'Silk Whisper Set',             category: 'Formal',  price: 24500, originalPrice: 29900 },
  { productId: 'zaybaash-003', name: 'Meadow Bloom Midi',            category: 'Casual',  price: 18900 },
  { productId: 'zaybaash-004', name: 'Midnight Lace Gown',           category: 'Dresses', price: 32500 },
  { productId: 'zaybaash-005', name: 'Pearl Cascade Dress',          category: 'Formal',  price: 27800, originalPrice: 33000 },
  { productId: 'zaybaash-006', name: 'Garden Party Dress',           category: 'Casual',  price: 21500 },
  { productId: 'zaybaash-007', name: 'Royal Emerald Gown',           category: 'Dresses', price: 35000 },
  { productId: 'zaybaash-008', name: 'Blossom Two-Piece Set',        category: 'Casual',  price: 19800, originalPrice: 24500 },
  { productId: 'zaybaash-009', name: 'Crystal Evening Gown',         category: 'Formal',  price: 42000 },
  { productId: 'zaybaash-010', name: 'Saffron Sunset Dress',         category: 'Dresses', price: 23500 },
  { productId: 'zaybaash-011', name: 'Azure Dream Maxi',             category: 'Casual',  price: 17900, originalPrice: 21000 },
  { productId: 'zaybaash-012', name: 'Champagne Soirée Gown',        category: 'Formal',  price: 38500 },
];

export async function GET() {
  try {
    await connectDB();

    let inserted = 0;
    let skipped  = 0;

    for (const p of seedProducts) {
      const exists = await Product.findOne({ productId: p.productId });
      if (exists) { skipped++; continue; }

      await Product.create({
        ...p,
        costPrice: Math.round(p.price * COST_RATIO),
        stock:     50,
        sold:      0,
        isNewArrival:     ['zaybaash-001','zaybaash-007','zaybaash-009'].includes(p.productId),
        isSale:    !!p.originalPrice,
        isBestseller: ['zaybaash-002','zaybaash-005','zaybaash-012'].includes(p.productId),
      });
      inserted++;
    }

    return NextResponse.json({
      message: `Seed complete. Inserted: ${inserted}, Skipped (already exist): ${skipped}`,
    });
  } catch (err) {
    console.error('GET /api/seed error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
