/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const dns = require('dns').promises;
const mongoose = require('mongoose');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(process.cwd(), '.env.local'));

const MONGODB_URI = (process.env.MONGODB_URI || '').trim();
if (!MONGODB_URI) {
  console.error('MONGODB_URI is missing in .env.local');
  process.exit(1);
}

async function buildDirectMongoUriFromSrv(uri) {
  const parsed = new URL(uri);
  if (parsed.protocol !== 'mongodb+srv:') {
    return uri;
  }

  const srvHosts = await dns.resolveSrv(parsed.hostname);
  if (!srvHosts.length) {
    throw new Error(`No SRV records found for ${parsed.hostname}`);
  }

  const txtRecords = await dns.resolveTxt(parsed.hostname).catch(() => []);
  const txtQuery = txtRecords
    .flat()
    .join('&')
    .trim();

  const query = new URLSearchParams(parsed.searchParams);
  if (txtQuery) {
    const txtParams = new URLSearchParams(txtQuery);
    for (const [key, value] of txtParams.entries()) {
      if (!query.has(key)) {
        query.set(key, value);
      }
    }
  }

  if (!query.has('tls')) {
    query.set('tls', 'true');
  }

  const hosts = srvHosts.map((host) => `${host.name}:${host.port}`).join(',');
  const username = parsed.username ? decodeURIComponent(parsed.username) : '';
  const password = parsed.password ? decodeURIComponent(parsed.password) : '';
  const auth = username
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
    : '';
  const database = parsed.pathname.replace(/^\//, '');
  const queryString = query.toString();

  return `mongodb://${auth}${hosts}/${database}${queryString ? `?${queryString}` : ''}`;
}

async function connectWithFallback(uri) {
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || undefined });
    return uri;
  } catch (err) {
    if (!uri.startsWith('mongodb+srv://')) {
      throw err;
    }

    const directUri = await buildDirectMongoUriFromSrv(uri);
    if (directUri === uri) {
      throw err;
    }

    console.warn('SRV connection failed, retrying with direct MongoDB URI...');
    await mongoose.connect(directUri, { dbName: process.env.MONGODB_DB || undefined });
    return directUri;
  }
}

const baseSizeChart = [
  { size: 'S', chest: 19, waist: 17, hips: 21, length: 42 },
  { size: 'M', chest: 20, waist: 18, hips: 22, length: 43 },
  { size: 'L', chest: 22, waist: 20, hips: 24, length: 44 },
];

function shiftChart(lengthDelta) {
  return baseSizeChart.map((row) => ({ ...row, length: row.length + lengthDelta }));
}

const products = [
  {
    productId: 'zbpk-001',
    name: 'Karachi Lawn Co-ord Set',
    category: 'Lawn Pret',
    price: 7490,
    originalPrice: 8990,
    costPrice: 3800,
    images: [
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
    colors: [{ name: 'Sea Green', hex: '#6B8F81' }, { name: 'Ivory', hex: '#F3EFE8' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(0),
    description: 'Two-piece stitched lawn suit tailored for warm weather with breathable finish and straight shirt silhouette.',
    details: ['Premium summer lawn', 'Dyed trouser included', 'Lightweight and breathable', 'Machine wash cold'],
    rating: 4.7,
    reviewCount: 61,
    tags: ['lawn', 'stitched', 'summer', 'pakistan'],
    stock: 34,
    sold: 22,
    isActive: true,
    outOfStock: false,
    isNewArrival: true,
    isSale: true,
    isBestseller: false,
  },
  {
    productId: 'zbpk-002',
    name: 'Lahore Embroidered Kurta Set',
    category: 'Lawn Pret',
    price: 8690,
    costPrice: 4300,
    images: [
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1200&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=80',
    colors: [{ name: 'Off White', hex: '#F5F1EA' }, { name: 'Sandal', hex: '#CDAA7D' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(1),
    description: 'Classic embroidered kurta with matching trouser inspired by contemporary Lahore pret cuts.',
    details: ['Dyed cotton base', 'Neckline embroidery', 'Straight fit', 'Hand wash recommended'],
    rating: 4.8,
    reviewCount: 74,
    tags: ['kurta', 'embroidered', 'pret'],
    stock: 29,
    sold: 31,
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: false,
    isBestseller: true,
  },
  {
    productId: 'zbpk-003',
    name: 'Rawalpindi Printed Lawn Shirt',
    category: 'Lawn Pret',
    price: 5590,
    costPrice: 2800,
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    colors: [{ name: 'Mauve', hex: '#B68AA0' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(-1),
    description: 'Single stitched lawn shirt with all-over print and everyday fit for daily wear.',
    details: ['Premium printed lawn', 'Single shirt', 'Soft finish', 'Easy care fabric'],
    rating: 4.6,
    reviewCount: 48,
    tags: ['single shirt', 'lawn', 'daily wear'],
    stock: 41,
    sold: 17,
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: false,
    isBestseller: false,
  },
  {
    productId: 'zbpk-004',
    name: 'Islamabad Cotton Silk Pret',
    category: 'Luxury Pret',
    price: 12490,
    originalPrice: 14990,
    costPrice: 6200,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1200&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027614a9?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027614a9?w=1200&q=80',
    colors: [{ name: 'Pista', hex: '#BFD8C0' }, { name: 'Stone', hex: '#C8BCAC' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(1),
    description: 'Luxury pret set in cotton silk blend with subtle sheen and clean tailoring lines.',
    details: ['Cotton silk blend', 'Two-piece stitched', 'Premium finish', 'Dry clean preferred'],
    rating: 4.8,
    reviewCount: 55,
    tags: ['luxury pret', 'cotton silk'],
    stock: 18,
    sold: 19,
    isActive: true,
    outOfStock: false,
    isNewArrival: true,
    isSale: true,
    isBestseller: true,
  },
  {
    productId: 'zbpk-005',
    name: 'Multan Chikankari Pret Suit',
    category: 'Luxury Pret',
    price: 13990,
    costPrice: 7000,
    images: [
      'https://images.unsplash.com/photo-1566479179817-0c9c4acec19b?w=1200&q=80',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1566479179817-0c9c4acec19b?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1200&q=80',
    colors: [{ name: 'Ice Blue', hex: '#B8D5E3' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(0),
    description: 'Chikankari-inspired stitched pret suit with delicate detailing and premium fall.',
    details: ['Fine lawn-cotton blend', 'Handfeel embroidery look', 'Straight trouser', 'Do not bleach'],
    rating: 4.9,
    reviewCount: 83,
    tags: ['chikankari', 'luxury pret', 'eid'],
    stock: 15,
    sold: 43,
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: false,
    isBestseller: true,
  },
  {
    productId: 'zbpk-006',
    name: 'Peshawar Jacquard Kurta',
    category: 'Luxury Pret',
    price: 11490,
    costPrice: 5600,
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1200&q=80',
      'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8cd?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8cd?w=1200&q=80',
    colors: [{ name: 'Charcoal', hex: '#4A4A4A' }, { name: 'Deep Olive', hex: '#58614B' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(2),
    description: 'Jacquard textured long kurta designed for evening semi-formal occasions.',
    details: ['Textured jacquard', 'Long silhouette', 'Two-piece set', 'Steam press for best look'],
    rating: 4.7,
    reviewCount: 39,
    tags: ['jacquard', 'evening', 'premium'],
    stock: 22,
    sold: 14,
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: false,
    isBestseller: false,
  },
  {
    productId: 'zbpk-007',
    name: 'Karachi Wedding Formal Maxi',
    category: 'Formal',
    price: 28990,
    originalPrice: 32990,
    costPrice: 14500,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200&q=80',
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200&q=80',
    colors: [{ name: 'Ruby', hex: '#8E3B46' }, { name: 'Navy', hex: '#22314D' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(5),
    description: 'Heavily finished formal maxi suitable for wedding events and evening functions.',
    details: ['Formal net blend', 'Inner lining included', 'Flare silhouette', 'Dry clean only'],
    rating: 4.9,
    reviewCount: 92,
    tags: ['formal', 'wedding wear', 'maxi'],
    stock: 11,
    sold: 36,
    isActive: true,
    outOfStock: false,
    isNewArrival: true,
    isSale: true,
    isBestseller: true,
  },
  {
    productId: 'zbpk-008',
    name: 'Lahore Organza Formal Set',
    category: 'Formal',
    price: 24990,
    costPrice: 12300,
    images: [
      'https://images.unsplash.com/photo-1464863979621-258859e62245?w=1200&q=80',
      'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1464863979621-258859e62245?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&q=80',
    colors: [{ name: 'Rose Pink', hex: '#C989A0' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(4),
    description: 'Organza shirt with inner and trouser, crafted for festive dinners and formal gatherings.',
    details: ['Organza outer', 'Dyed grip trouser', 'Embellished neckline', 'Dry clean preferred'],
    rating: 4.8,
    reviewCount: 57,
    tags: ['organza', 'formal suit', 'event wear'],
    stock: 9,
    sold: 27,
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: false,
    isBestseller: true,
  },
  {
    productId: 'zbpk-009',
    name: 'Islamabad Eid Festive Kurta',
    category: 'Festive',
    price: 16990,
    costPrice: 8400,
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80',
    colors: [{ name: 'Mint', hex: '#9ABDAA' }, { name: 'Cream', hex: '#F2ECE1' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(1),
    description: 'Festive stitched kurta with subtle embellishment suitable for Eid day and family events.',
    details: ['Festive cotton-net blend', 'Soft lining', 'Straight cut', 'Delicate wash'],
    rating: 4.7,
    reviewCount: 46,
    tags: ['eid', 'festive', 'kurta'],
    stock: 20,
    sold: 18,
    isActive: true,
    outOfStock: false,
    isNewArrival: true,
    isSale: false,
    isBestseller: false,
  },
  {
    productId: 'zbpk-010',
    name: 'Multan Banarsi Festive Set',
    category: 'Festive',
    price: 21990,
    originalPrice: 25990,
    costPrice: 10900,
    images: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200&q=80',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200&q=80',
    colors: [{ name: 'Gold Beige', hex: '#C7AA7A' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(2),
    description: 'Banarsi-inspired festive outfit with refined texture and occasion-ready silhouette.',
    details: ['Banarsi-inspired weave look', 'Lined shirt', 'Matching trouser', 'Dry clean only'],
    rating: 4.8,
    reviewCount: 63,
    tags: ['banarsi', 'festive', 'eid collection'],
    stock: 14,
    sold: 29,
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: true,
    isBestseller: true,
  },
];

const categories = [
  { categoryId: 'cat-lawn-pret', name: 'Lawn Pret', slug: 'lawn-pret', description: 'Stitched lawn essentials for Pakistani summers', sortOrder: 1, isActive: true },
  { categoryId: 'cat-luxury-pret', name: 'Luxury Pret', slug: 'luxury-pret', description: 'Premium pret for elevated day and evening wear', sortOrder: 2, isActive: true },
  { categoryId: 'cat-formal', name: 'Formal', slug: 'formal', description: 'Event-ready formalwear for wedding season', sortOrder: 3, isActive: true },
  { categoryId: 'cat-festive', name: 'Festive', slug: 'festive', description: 'Festive edits crafted for Eid and celebrations', sortOrder: 4, isActive: true },
];

async function run() {
  await connectWithFallback(MONGODB_URI);

  const db = mongoose.connection.db;
  const now = new Date();

  await db.collection('products').deleteMany({});
  await db.collection('categories').deleteMany({});
  await db.collection('reviews').deleteMany({});

  await db.collection('categories').insertMany(
    categories.map((c) => ({
      ...c,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80',
      productCount: products.filter((p) => p.category === c.name).length,
      createdAt: now,
      updatedAt: now,
    })),
  );

  await db.collection('products').insertMany(
    products.map((p) => ({
      ...p,
      model3dUrl: '',
      model3dStatus: 'none',
      model3dError: '',
      model3dUpdatedAt: now,
      createdAt: now,
      updatedAt: now,
    })),
  );

  console.log(`Catalog reset complete. Inserted ${products.length} products and ${categories.length} categories.`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
