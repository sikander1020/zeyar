import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  reviewId: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  orderId?: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewId:           { type: String, required: true, unique: true },
    productId:          { type: String, required: true },
    productName:        { type: String, required: true },
    customerName:       { type: String, required: true },
    customerEmail:      { type: String, required: true },
    rating:             { type: Number, required: true, min: 1, max: 5 },
    title:              { type: String, default: '' },
    comment:            { type: String, required: true },
    images:             { type: [String], default: [] },
    isApproved:         { type: Boolean, default: false },
    isVerifiedPurchase: { type: Boolean, default: false },
    orderId:            { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Review ?? mongoose.model<IReview>('Review', ReviewSchema);
