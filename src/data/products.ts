export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'Dresses' | 'Casual' | 'Formal' | 'One Piece';
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  details: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 'zeyar-001',
    name: 'Velvet Reverie Gown',
    price: 289,
    originalPrice: 380,
    category: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1566479179817-0c9c4acec19b?w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    ],
    colors: [
      { name: 'Nude Rose', hex: '#E6B7A9' },
      { name: 'Ivory', hex: '#F5F0EB' },
      { name: 'Dusty Mauve', hex: '#B07E8B' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'An ethereal floor-length gown crafted from the finest Italian velvet. The draped silhouette flows effortlessly, creating a timeless elegance perfect for any occasion.',
    details: ['100% Italian Velvet', 'Dry Clean Only', 'Lined interior', 'Side invisible zipper', 'Model wears size S'],
    rating: 4.9,
    reviewCount: 127,
    isNew: true,
    isSale: true,
    tags: ['velvet', 'gown', 'evening', 'luxury'],
  },
  {
    id: 'zeyar-002',
    name: 'Aurora Silk Midi',
    price: 195,
    category: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    ],
    colors: [
      { name: 'Champagne', hex: '#F7E7CE' },
      { name: 'Blush', hex: '#F4B8C1' },
      { name: 'Sage', hex: '#B2C5B2' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'The Aurora Silk Midi embodies soft femininity. Cut from pure silk charmeuse, it drapes beautifully against the body, catching light with every movement.',
    details: ['100% Pure Silk Charmeuse', 'Hand wash cold', 'Slip-on style', 'Midi length', 'True to size'],
    rating: 4.7,
    reviewCount: 89,
    isNew: true,
    tags: ['silk', 'midi', 'daywear', 'feminine'],
  },
  {
    id: 'zeyar-003',
    name: 'Noir Elegance One Piece',
    price: 320,
    category: 'One Piece',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    ],
    colors: [
      { name: 'Midnight Black', hex: '#1A1A1A' },
      { name: 'Navy', hex: '#1B2E4B' },
      { name: 'Forest', hex: '#2D4A3E' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'A masterpiece of modest fashion — our Noir Elegance features hand-embroidered floral motifs along the cuffs and hem, creating a stunning contrast against fine crepe fabric.',
    details: ['Premium Crepe Fabric', 'Hand-embroidered details', 'Dry clean recommended', 'Full length', 'Open front style'],
    rating: 4.8,
    reviewCount: 214,
    isBestseller: true,
    tags: ['modest', 'elegant', 'embroidered'],
  },
  {
    id: 'zeyar-004',
    name: 'Desert Rose One Piece',
    price: 275,
    originalPrice: 340,
    category: 'One Piece',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027614a9?w=800&q=80',
      'https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=800&q=80',
    ],
    colors: [
      { name: 'Rose Dust', hex: '#E6B7A9' },
      { name: 'Sand', hex: '#D4BFA8' },
      { name: 'Ivory', hex: '#F5F0EB' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Inspired by the soft hues of desert sunsets, this piece features delicate lace trim and pearl buttons, bringing a romantic touch to modest elegance.',
    details: ['Chiffon overlay on Crepe base', 'Lace trim details', 'Pearl button closure', 'Dry clean only'],
    rating: 4.6,
    reviewCount: 156,
    isSale: true,
    tags: ['lace', 'romantic', 'modest'],
  },
  {
    id: 'zeyar-005',
    name: 'Linen Weekend Set',
    price: 165,
    category: 'Casual',
    images: [
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&q=80',
      'https://images.unsplash.com/photo-1539030160590-d7f47bcc3e2a?w=800&q=80',
    ],
    colors: [
      { name: 'Oat', hex: '#D4C5A9' },
      { name: 'Terracotta', hex: '#C97B63' },
      { name: 'Sky Blue', hex: '#A8C5DA' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Effortlessly chic for weekend adventures. This relaxed linen co-ord features wide-leg trousers and a cropped blazer, ideal for brunches and markets.',
    details: ['100% Pure Linen', 'Machine wash cold', 'Relaxed fit', 'Blazer + trouser set', 'Sustainable fabric'],
    rating: 4.5,
    reviewCount: 73,
    isNew: true,
    tags: ['linen', 'casual', 'co-ord', 'weekend'],
  },
  {
    id: 'zeyar-006',
    name: 'Knit Whisper Dress',
    price: 145,
    category: 'Casual',
    images: [
      'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=800&q=80',
      'https://images.unsplash.com/photo-1485518882345-15568b007407?w=800&q=80',
    ],
    colors: [
      { name: 'Cream', hex: '#F5F0EB' },
      { name: 'Caramel', hex: '#C4956A' },
      { name: 'Mocha', hex: '#7B5E52' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'A soft, body-skimming knit dress that transitions seamlessly from day to night. Crafted from a premium cashmere blend for ultimate comfort.',
    details: ['70% Cashmere 30% Merino', 'Hand wash cold', 'Midi length', 'Ribbed knit texture'],
    rating: 4.8,
    reviewCount: 102,
    isBestseller: true,
    tags: ['knit', 'cashmere', 'cozy', 'midi'],
  },
  {
    id: 'zeyar-007',
    name: 'Boardroom Blazer Set',
    price: 345,
    category: 'Formal',
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80',
    ],
    colors: [
      { name: 'Chalk', hex: '#F0EDE8' },
      { name: 'Charcoal', hex: '#4A4A4A' },
      { name: 'Navy', hex: '#2C3E6E' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Command any room in this power-dressing blazer set. Structured shoulders, a nipped waist, and premium suiting fabric make this the ultimate professional statement.',
    details: ['Italian Wool Blend', 'Dry clean only', 'Fully lined', 'Blazer + straight-leg trousers', 'Gold button details'],
    rating: 4.7,
    reviewCount: 68,
    tags: ['blazer', 'formal', 'professional', 'power-dressing'],
  },
  {
    id: 'zeyar-008',
    name: 'Evening Satin Jumpsuit',
    price: 225,
    originalPrice: 290,
    category: 'Formal',
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
      'https://images.unsplash.com/photo-1566479179817-0c9c4acec19b?w=800&q=80',
    ],
    colors: [
      { name: 'Champagne', hex: '#F7E7CE' },
      { name: 'Rose Gold', hex: '#B76E79' },
      { name: 'Midnight', hex: '#1A1A2E' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Sleek, sophisticated, and utterly glamorous. This wide-leg satin jumpsuit features a plunging neckline and dramatic palazzo legs for an unforgettable evening look.',
    details: ['100% Satin Polyester', 'Dry clean recommended', 'V-neckline', 'Wide-leg palazzo trousers', 'Belt included'],
    rating: 4.9,
    reviewCount: 143,
    isSale: true,
    tags: ['satin', 'jumpsuit', 'evening', 'glamorous'],
  },
  {
    id: 'zeyar-009',
    name: 'Floral Chiffon Maxi',
    price: 175,
    category: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
    ],
    colors: [
      { name: 'Garden Blush', hex: '#F4B8C1' },
      { name: 'Sky Garden', hex: '#A8D5E2' },
      { name: 'Meadow Ivory', hex: '#F5F0EB' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Drift through summer days in this ethereal floral chiffon maxi. Hand-painted botanical prints on sheer chiffon create a wearable work of art.',
    details: ['100% Silk Chiffon', 'Hand wash delicately', 'Floor length', 'Adjustable spaghetti straps', 'Lined'],
    rating: 4.6,
    reviewCount: 91,
    isNew: true,
    tags: ['floral', 'chiffon', 'maxi', 'summer'],
  },
  {
    id: 'zeyar-010',
    name: 'Crystal Embroidered One Piece',
    price: 485,
    category: 'One Piece',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80',
    ],
    colors: [
      { name: 'Ivory Pearl', hex: '#F5F0EB' },
      { name: 'Silver Mist', hex: '#C8D0D8' },
      { name: 'Gold Dusk', hex: '#C8A96E' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Our most opulent creation — the Crystal Embroidered piece features thousands of hand-sewn Austrian crystals creating an intricate floral motif. A true heirloom piece.',
    details: ['Premium Nida Fabric', 'Austrian Crystal embellishments', 'Dry clean only', 'Full length', 'Couture quality'],
    rating: 5.0,
    reviewCount: 45,
    isBestseller: true,
    tags: ['crystal', 'luxury', 'couture'],
  },
  {
    id: 'zeyar-011',
    name: 'Minimalist Linen Shift',
    price: 120,
    category: 'Casual',
    images: [
      'https://images.unsplash.com/photo-1485518882345-15568b007407?w=800&q=80',
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&q=80',
    ],
    colors: [
      { name: 'Stone', hex: '#C5B9A8' },
      { name: 'White', hex: '#FAFAFA' },
      { name: 'Rust', hex: '#B55B3E' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'The perfect wardrobe staple. This relaxed linen shift dress is designed for effortless elegance — wear it alone or layer it for a polished everyday look.',
    details: ['100% European Linen', 'Machine wash cool', 'Midi length', 'Pockets included', 'Relaxed fit'],
    rating: 4.4,
    reviewCount: 186,
    tags: ['linen', 'shift', 'minimalist', 'everyday'],
  },
  {
    id: 'zeyar-012',
    name: 'Power Suit in Ivory',
    price: 395,
    category: 'Formal',
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&q=80',
      'https://images.unsplash.com/photo-1539030160590-d7f47bcc3e2a?w=800&q=80',
    ],
    colors: [
      { name: 'Ivory', hex: '#F5F0EB' },
      { name: 'Blush', hex: '#F4B8C1' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Redefine power dressing with this stunning ivory suit. A relaxed double-breasted blazer paired with high-waisted wide trousers for a commanding silhouette.',
    details: ['Premium Crepe Suiting', 'Dry clean only', 'Fully lined blazer', 'High-rise trousers', 'Matching set'],
    rating: 4.8,
    reviewCount: 77,
    isNew: true,
    tags: ['suit', 'power', 'formal', 'ivory'],
  },
];

export const categories = [
  {
    id: 'one-piece',
    name: 'One Piece',
    description: 'Modest luxury reimagined',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b69c8?w=800&q=80',
    count: products.filter(p => p.category === 'One Piece').length,
  },
  {
    id: 'dresses',
    name: 'Dresses',
    description: 'From ethereal maxis to sleek midis',
    image: 'https://images.unsplash.com/photo-1566479179817-0c9c4acec19b?w=800&q=80',
    count: products.filter(p => p.category === 'Dresses').length,
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Effortlessly elegant everyday wear',
    image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&q=80',
    count: products.filter(p => p.category === 'Casual').length,
  },
  {
    id: 'formal',
    name: 'Formal',
    description: 'Power dressing for modern women',
    image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&q=80',
    count: products.filter(p => p.category === 'Formal').length,
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Layla Al-Rashid',
    title: 'Fashion Editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    text: 'ZEYAR is unlike anything I\'ve experienced. The craftsmanship is extraordinary — you can feel the love and attention in every stitch. My Velvet Reverie Gown received more compliments in one evening than any piece I\'ve owned.',
    product: 'Velvet Reverie Gown',
  },
  {
    id: 2,
    name: 'Amira Hassan',
    title: 'Interior Designer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
    rating: 5,
    text: 'I discovered ZEYAR looking for modest fashion that didn\'t compromise on elegance. Their Crystal Embroidered One Piece is a masterpiece. Worth every penny — people stopped me to ask where it was from.',
    product: 'Crystal Embroidered One Piece',
  },
  {
    id: 3,
    name: 'Nour Khalid',
    title: 'Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    rating: 5,
    text: 'The quality speaks for itself. I\'ve ordered from ZEYAR three times now and each piece is better than the last. The packaging alone feels like an experience — this is what luxury fashion should feel like.',
    product: 'Boardroom Blazer Set',
  },
];
