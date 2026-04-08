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
    isNewArrival:  { type: Boolean, default: false },
    isSale:        { type: Boolean, default: false },
    isBestseller:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);
