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
  colors: Array<{ name: string; hex: string }>;
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  outOfStock: boolean;
  isNewArrival?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
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
  },
  { timestamps: true }
);

export default mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);
