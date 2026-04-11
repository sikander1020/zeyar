import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;
  usageLimit: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableCategories: string[];
  applicableProducts: string[];
}

const CouponSchema = new Schema<ICoupon>(
  {
    code:               { type: String, required: true, unique: true, uppercase: true },
    description:        { type: String, default: '' },
    discountType:       { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue:      { type: Number, required: true },
    minOrderValue:      { type: Number, default: 0 },
    maxDiscountValue:   { type: Number, default: 0 },
    usageLimit:         { type: Number, default: 0 }, // 0 = unlimited
    usedCount:          { type: Number, default: 0 },
    startDate:          { type: Date, required: true },
    endDate:            { type: Date, required: true },
    isActive:           { type: Boolean, default: true },
    applicableCategories: { type: [String], default: [] },
    applicableProducts:   { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon ?? mongoose.model<ICoupon>('Coupon', CouponSchema);
