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
