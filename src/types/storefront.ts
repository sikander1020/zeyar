export interface StoreColor {
  name: string;
  hex: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors: StoreColor[];
  sizes: string[];
  sizeChartRows: Array<{
    size: string;
    chest: number;
    waist: number;
    hips: number;
    length: number;
  }>;
  description: string;
  details: string[];
  rating: number;
  reviewCount: number;
  tags: string[];
  stock: number;
  isActive: boolean;
  outOfStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  frontImageUrl?: string;
  backImageUrl?: string;
  sizeChartImageUrl?: string;
  videoUrl?: string;
  model3dUrl?: string;
  model3dStatus?: 'none' | 'pending' | 'ready' | 'failed';
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  count: number;
}
