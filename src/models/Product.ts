import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  productId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  costPrice: number;
  stock: number;
  sold: number;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
  sizeChartRows: Array<{
    size: string;
    chest: number;
    waist: number;
    hips: number;
    length: number;
  }>;
  colors: Array<{ name: string; hex: string }>;
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  outOfStock: boolean;
  isNewArrival?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  frontImageUrl?: string;
  backImageUrl?: string;
  videoUrl?: string;
  model3dUrl?: string;
  model3dStatus?: 'none' | 'pending' | 'ready' | 'failed';
  model3dError?: string;
  model3dUpdatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    productId:     { type: String, required: true, unique: true },
    name:          { type: String, required: true },
    category:      { type: String, required: true },
    price:         { type: Number, required: true },
    originalPrice: { type: Number },
    costPrice:     { type: Number, required: true },
    stock:         { type: Number, default: 50 },
    sold:          { type: Number, default: 0 },
    images:        { type: [String], default: [] },
    description:   { type: String, default: '' },
    details:       { type: [String], default: [] },
    sizes:         { type: [String], default: ['S', 'M', 'L'] },
    sizeChartRows: {
      type: [{
        size: { type: String, required: true },
        chest: { type: Number, required: true },
        waist: { type: Number, required: true },
        hips: { type: Number, required: true },
        length: { type: Number, required: true },
      }],
      default: [],
    },
    colors: {
      type: [{
        name: { type: String, required: true },
        hex: { type: String, required: true },
      }],
      default: [{ name: 'Default', hex: '#E6B7A9' }],
    },
    rating:        { type: Number, default: 4.8 },
    reviewCount:   { type: Number, default: 0 },
    tags:          { type: [String], default: [] },
    isActive:      { type: Boolean, default: true },
    outOfStock:    { type: Boolean, default: false },
    isNewArrival:  { type: Boolean, default: false },
    isSale:        { type: Boolean, default: false },
    isBestseller:  { type: Boolean, default: false },
    frontImageUrl: { type: String, default: '' },
    backImageUrl:  { type: String, default: '' },
    videoUrl:      { type: String, default: '' },
    model3dUrl:    { type: String, default: '' },
    model3dStatus: { type: String, enum: ['none', 'pending', 'ready', 'failed'], default: 'none' },
    model3dError:  { type: String, default: '' },
    model3dUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);
