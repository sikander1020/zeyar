import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  categoryId: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    categoryId:    { type: String, required: true, unique: true },
    name:          { type: String, required: true },
    description:   { type: String, default: '' },
    image:         { type: String, default: '' },
    slug:          { type: String, required: true, unique: true },
    isActive:      { type: Boolean, default: true },
    sortOrder:     { type: Number, default: 0 },
    productCount:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Category ?? mongoose.model<ICategory>('Category', CategorySchema);
