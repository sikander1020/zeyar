import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Category from '@/models/Category';
import { requireAdmin } from '@/lib/adminAuth';

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

export async function GET(req: NextRequest) {
  try {
    // Dev mode: skip auth for easy seeding; production requires admin.
    if (process.env.NODE_ENV === 'production') {
      const guard = requireAdmin(req);
      if (guard) return guard;
    }
    await connectDB();

    let productsInserted = 0;
    let categoriesInserted = 0;
    let ordersInserted = 0;

    // ── Seed Categories ───────────────────────────────────────────────
    const categories = [
      { categoryId: 'cat-one-piece', name: 'One Piece', slug: 'one-piece', description: 'Modest luxury reimagined', sortOrder: 1 },
      { categoryId: 'cat-dresses', name: 'Dresses', slug: 'dresses', description: 'From ethereal maxis to sleek midis', sortOrder: 2 },
      { categoryId: 'cat-casual', name: 'Casual', slug: 'casual', description: 'Effortlessly elegant everyday wear', sortOrder: 3 },
      { categoryId: 'cat-formal', name: 'Formal', slug: 'formal', description: 'Power dressing for modern women', sortOrder: 4 },
    ];

    for (const cat of categories) {
      const exists = await Category.findOne({ categoryId: cat.categoryId });
      if (!exists) {
        await Category.create({
          ...cat,
          image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80',
          isActive: true,
          productCount: 0,
        });
        categoriesInserted++;
      }
    }

    // ── Seed Products ─────────────────────────────────────────────────
    for (const p of seedProducts) {
      const exists = await Product.findOne({ productId: p.productId });
      if (exists) continue;

      await Product.create({
        ...p,
        costPrice: Math.round(p.price * COST_RATIO),
        stock: 50,
        sold: 0,
        isNewArrival: ['zaybaash-001', 'zaybaash-007', 'zaybaash-009'].includes(p.productId),
        isSale: !!p.originalPrice,
        isBestseller: ['zaybaash-002', 'zaybaash-005', 'zaybaash-012'].includes(p.productId),
      });
      productsInserted++;
    }

    // ── Seed Sample Orders ────────────────────────────────────────────
    const sampleOrders = [
      {
        orderId: 'ZB-2024-001',
        customer: {
          firstName: 'Ayesha',
          lastName: 'Khan',
          email: 'ayesha.khan@email.com',
          phone: '+92-300-1234567',
          address: 'House 123, Street 45, F-8/2',
          city: 'Islamabad',
          state: 'ICT',
          zip: '44000',
          country: 'Pakistan',
        },
        items: [
          { productId: 'zaybaash-001', name: 'Velvet Reverie Gown', category: 'Dresses', qty: 1, price: 28900, size: 'M', color: 'Nude Rose' },
        ],
        subtotal: 28900,
        discount: 0,
        total: 28900,
        paymentMethod: 'COD',
        paymentStatus: 'paid',
        status: 'delivered',
        createdAt: new Date('2024-11-15'),
      },
      {
        orderId: 'ZB-2024-002',
        customer: {
          firstName: 'Fatima',
          lastName: 'Ali',
          email: 'fatima.ali@email.com',
          phone: '+92-321-7654321',
          address: 'Plot 67, Block 12',
          city: 'Karachi',
          state: 'Sindh',
          zip: '75500',
          country: 'Pakistan',
        },
        items: [
          { productId: 'zaybaash-002', name: 'Silk Whisper Set', category: 'Formal', qty: 1, price: 24500, size: 'S', color: 'Champagne' },
          { productId: 'zaybaash-003', name: 'Meadow Bloom Midi', category: 'Casual', qty: 2, price: 18900, size: 'M', color: 'Sage' },
        ],
        subtotal: 62300,
        discount: 5000,
        total: 57300,
        paymentMethod: 'bank',
        paymentStatus: 'paid',
        status: 'shipped',
        bankTransfer: {
          uploadToken: 'bt_001',
          transactionId: 'TXN987654321',
          proofUrl: 'https://example.com/proof.jpg',
          submittedAt: new Date('2024-12-01'),
          status: 'approved',
          reviewedAt: new Date('2024-12-02'),
        },
        createdAt: new Date('2024-11-28'),
      },
      {
        orderId: 'ZB-2024-003',
        customer: {
          firstName: 'Sara',
          lastName: 'Ahmed',
          email: 'sara.ahmed@email.com',
          phone: '+92-333-9876543',
          address: '25-A, Gulberg III',
          city: 'Lahore',
          state: 'Punjab',
          zip: '54660',
          country: 'Pakistan',
        },
        items: [
          { productId: 'zaybaash-007', name: 'Royal Emerald Gown', category: 'Dresses', qty: 1, price: 35000, size: 'L', color: 'Emerald' },
        ],
        subtotal: 35000,
        discount: 0,
        total: 35000,
        paymentMethod: 'COD',
        paymentStatus: 'unpaid',
        status: 'pending',
        createdAt: new Date('2024-12-10'),
      },
      {
        orderId: 'ZB-2024-004',
        customer: {
          firstName: 'Zainab',
          lastName: 'Hassan',
          email: 'zainab.h@email.com',
          phone: '+92-345-1122334',
          address: 'House 89, Street 12, F-10/3',
          city: 'Islamabad',
          state: 'ICT',
          zip: '44000',
          country: 'Pakistan',
        },
        items: [
          { productId: 'zaybaash-009', name: 'Crystal Evening Gown', category: 'Formal', qty: 1, price: 42000, size: 'M', color: 'Silver' },
        ],
        subtotal: 42000,
        discount: 2000,
        total: 40000,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        status: 'confirmed',
        createdAt: new Date('2024-12-08'),
      },
      {
        orderId: 'ZB-2024-005',
        customer: {
          firstName: 'Hira',
          lastName: 'Malik',
          email: 'hira.malik@email.com',
          phone: '+92-301-5566778',
          address: 'Plot 234, DHA Phase 6',
          city: 'Karachi',
          state: 'Sindh',
          zip: '75600',
          country: 'Pakistan',
        },
        items: [
          { productId: 'zaybaash-005', name: 'Pearl Cascade Dress', category: 'Formal', qty: 1, price: 27800, size: 'S', color: 'Pearl White' },
          { productId: 'zaybaash-008', name: 'Blossom Two-Piece Set', category: 'Casual', qty: 1, price: 19800, size: 'M', color: 'Blush' },
        ],
        subtotal: 47600,
        discount: 3000,
        total: 44600,
        paymentMethod: 'COD',
        paymentStatus: 'paid',
        status: 'delivered',
        createdAt: new Date('2024-11-20'),
      },
    ];

    for (const order of sampleOrders) {
      const exists = await Order.findOne({ orderId: order.orderId });
      if (!exists) {
        await Order.create(order);
        ordersInserted++;
      }
    }

    return NextResponse.json({
      message: 'Database seeded successfully!',
      details: {
        categories: `${categoriesInserted} inserted`,
        products: `${productsInserted} inserted`,
        orders: `${ordersInserted} inserted`,
      },
    });
  } catch (err) {
    console.error('GET /api/seed error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
