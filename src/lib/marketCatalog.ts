type SizeChartRow = {
  size: string;
  chest: number;
  waist: number;
  hips: number;
  length: number;
};

type CatalogProduct = {
  productId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  costPrice: number;
  stock: number;
  sold: number;
  images: string[];
  frontImageUrl: string;
  backImageUrl: string;
  colors: Array<{ name: string; hex: string }>;
  sizes: string[];
  sizeChartRows: SizeChartRow[];
  description: string;
  details: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  outOfStock: boolean;
  isNewArrival: boolean;
  isSale: boolean;
  isBestseller: boolean;
  model3dUrl: string;
  model3dStatus: 'none' | 'pending' | 'ready' | 'failed';
  model3dError: string;
};

type CatalogCategory = {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
};

const baseChart: SizeChartRow[] = [
  { size: 'S', chest: 19, waist: 17, hips: 21, length: 42 },
  { size: 'M', chest: 20, waist: 18, hips: 22, length: 43 },
  { size: 'L', chest: 22, waist: 20, hips: 24, length: 44 },
];

function shiftChart(deltaLength: number): SizeChartRow[] {
  return baseChart.map((row) => ({ ...row, length: row.length + deltaLength }));
}

export const marketCatalogCategories: CatalogCategory[] = [
  {
    categoryId: 'cat-lawn-pret',
    name: 'Lawn Pret',
    slug: 'lawn-pret',
    description: 'Stitched lawn outfits for everyday summer wear in Pakistan.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=1200&q=80',
    sortOrder: 1,
    isActive: true,
  },
  {
    categoryId: 'cat-luxury-pret',
    name: 'Luxury Pret',
    slug: 'luxury-pret',
    description: 'Premium pret with richer fabrics and occasion-friendly cuts.',
    image: 'https://images.unsplash.com/photo-1566479179817-0c9c4acec19b?w=1200&q=80',
    sortOrder: 2,
    isActive: true,
  },
  {
    categoryId: 'cat-formal',
    name: 'Formal',
    slug: 'formal',
    description: 'Wedding and event outfits with elevated detailing.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200&q=80',
    sortOrder: 3,
    isActive: true,
  },
  {
    categoryId: 'cat-festive',
    name: 'Festive',
    slug: 'festive',
    description: 'Festive edits for Eid and family occasions.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80',
    sortOrder: 4,
    isActive: true,
  },
];

export const marketCatalogProducts: CatalogProduct[] = [
  {
    productId: 'zbpk-101',
    name: 'Printed Summer Lawn 2PC - Sage Bloom',
    category: 'Lawn Pret',
    price: 6490,
    originalPrice: 7490,
    costPrice: 3200,
    stock: 28,
    sold: 19,
    images: [
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80',
    colors: [{ name: 'Sage', hex: '#7F9A8C' }, { name: 'Ivory', hex: '#F2EDE3' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(0),
    description: 'Breathable stitched lawn two-piece with straight shirt and dyed trouser.',
    details: ['Summer lawn fabric', '2 piece stitched', 'Soft finish', 'Machine wash cold'],
    rating: 4.7,
    reviewCount: 54,
    tags: ['lawn', '2pc', 'summer', 'pakistan'],
    isActive: true,
    outOfStock: false,
    isNewArrival: true,
    isSale: true,
    isBestseller: false,
    model3dUrl: '',
    model3dStatus: 'none',
    model3dError: '',
  },
  {
    productId: 'zbpk-102',
    name: 'Embroidered Lawn Kurta - Off White',
    category: 'Lawn Pret',
    price: 8290,
    costPrice: 4100,
    stock: 22,
    sold: 24,
    images: [
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1200&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=80',
    colors: [{ name: 'Off White', hex: '#F5F1E8' }, { name: 'Sand', hex: '#C9AA83' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(1),
    description: 'Everyday embroidered lawn kurta set with clean neckline details.',
    details: ['Fine lawn', 'Embroidered neck', 'Straight fit', 'Hand wash recommended'],
    rating: 4.8,
    reviewCount: 70,
    tags: ['embroidered', 'kurta', 'lawn'],
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: false,
    isBestseller: true,
    model3dUrl: '',
    model3dStatus: 'none',
    model3dError: '',
  },
  {
    productId: 'zbpk-103',
    name: 'Luxury Cotton Silk Set - Pista',
    category: 'Luxury Pret',
    price: 12490,
    originalPrice: 14490,
    costPrice: 6200,
    stock: 16,
    sold: 15,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1200&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027614a9?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027614a9?w=1200&q=80',
    colors: [{ name: 'Pista', hex: '#C1D7C4' }, { name: 'Stone', hex: '#C8B9A6' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(1),
    description: 'Premium cotton-silk two-piece for dinner and small events.',
    details: ['Cotton silk blend', '2 piece stitched', 'Soft sheen', 'Dry clean preferred'],
    rating: 4.8,
    reviewCount: 59,
    tags: ['luxury pret', 'cotton silk', 'premium'],
    isActive: true,
    outOfStock: false,
    isNewArrival: true,
    isSale: true,
    isBestseller: true,
    model3dUrl: '',
    model3dStatus: 'none',
    model3dError: '',
  },
  {
    productId: 'zbpk-104',
    name: 'Chikankari-Inspired Pret - Ice Blue',
    category: 'Luxury Pret',
    price: 13990,
    costPrice: 6900,
    stock: 14,
    sold: 33,
    images: [
      'https://images.unsplash.com/photo-1566479179817-0c9c4acec19b?w=1200&q=80',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1566479179817-0c9c4acec19b?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=1200&q=80',
    colors: [{ name: 'Ice Blue', hex: '#B5D4E1' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(0),
    description: 'Stitched pret with delicate embroidery-inspired finish and clean fall.',
    details: ['Premium blend', 'Soft lining', 'Straight pants', 'Do not bleach'],
    rating: 4.9,
    reviewCount: 82,
    tags: ['pret', 'embroidered', 'premium'],
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: false,
    isBestseller: true,
    model3dUrl: '',
    model3dStatus: 'none',
    model3dError: '',
  },
  {
    productId: 'zbpk-105',
    name: 'Wedding Formal Maxi - Ruby',
    category: 'Formal',
    price: 27990,
    originalPrice: 31990,
    costPrice: 13900,
    stock: 10,
    sold: 27,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200&q=80',
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200&q=80',
    colors: [{ name: 'Ruby', hex: '#8D3C45' }, { name: 'Navy', hex: '#23324C' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(5),
    description: 'Formal maxi with full flare for wedding and reception events.',
    details: ['Formal fabric blend', 'Inner lining', 'Flared silhouette', 'Dry clean only'],
    rating: 4.9,
    reviewCount: 93,
    tags: ['formal', 'wedding', 'maxi'],
    isActive: true,
    outOfStock: false,
    isNewArrival: true,
    isSale: true,
    isBestseller: true,
    model3dUrl: '',
    model3dStatus: 'none',
    model3dError: '',
  },
  {
    productId: 'zbpk-106',
    name: 'Organza Formal 3PC - Rose Pink',
    category: 'Formal',
    price: 24490,
    costPrice: 12100,
    stock: 9,
    sold: 18,
    images: [
      'https://images.unsplash.com/photo-1464863979621-258859e62245?w=1200&q=80',
      'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1464863979621-258859e62245?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200&q=80',
    colors: [{ name: 'Rose Pink', hex: '#C8899E' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(4),
    description: 'Organza formal set for event nights and festive dinners.',
    details: ['Organza shirt', 'Dyed trouser', 'Lined shirt', 'Dry clean only'],
    rating: 4.8,
    reviewCount: 58,
    tags: ['organza', 'formal', '3pc'],
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: false,
    isBestseller: true,
    model3dUrl: '',
    model3dStatus: 'none',
    model3dError: '',
  },
  {
    productId: 'zbpk-107',
    name: 'Festive Kurta Set - Mint',
    category: 'Festive',
    price: 16490,
    costPrice: 8200,
    stock: 20,
    sold: 17,
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80',
    colors: [{ name: 'Mint', hex: '#9ABEA9' }, { name: 'Cream', hex: '#F1EAD9' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(1),
    description: 'Eid-ready kurta set with soft festive finish and elegant drape.',
    details: ['Festive blend', 'Straight fit', 'Lined body', 'Delicate wash'],
    rating: 4.7,
    reviewCount: 44,
    tags: ['eid', 'festive', 'kurta'],
    isActive: true,
    outOfStock: false,
    isNewArrival: true,
    isSale: false,
    isBestseller: false,
    model3dUrl: '',
    model3dStatus: 'none',
    model3dError: '',
  },
  {
    productId: 'zbpk-108',
    name: 'Banarsi Festive Edit - Gold Beige',
    category: 'Festive',
    price: 21490,
    originalPrice: 24990,
    costPrice: 10800,
    stock: 13,
    sold: 21,
    images: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200&q=80',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200&q=80',
    ],
    frontImageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200&q=80',
    colors: [{ name: 'Gold Beige', hex: '#C7A878' }],
    sizes: ['S', 'M', 'L'],
    sizeChartRows: shiftChart(2),
    description: 'Banarsi-inspired stitched festive outfit for Eid and formal get-togethers.',
    details: ['Festive weave feel', 'Lined shirt', 'Straight trouser', 'Dry clean preferred'],
    rating: 4.8,
    reviewCount: 61,
    tags: ['banarsi', 'festive', 'eid collection'],
    isActive: true,
    outOfStock: false,
    isNewArrival: false,
    isSale: true,
    isBestseller: true,
    model3dUrl: '',
    model3dStatus: 'none',
    model3dError: '',
  },
];
