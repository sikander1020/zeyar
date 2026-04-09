import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  category: string;
  qty: number;
  price: number;
  size: string;
  color: string;
}

export interface IOrder extends Document {
  orderId: string;
  createdAt: Date;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'COD' | 'card' | 'bank';
  paymentStatus: 'unpaid' | 'paid';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  bankTransfer?: {
    uploadToken: string;
    transactionId?: string;
    proofUrl?: string;
    submittedAt?: Date;
    status: 'awaiting_proof' | 'proof_submitted' | 'approved' | 'rejected';
    reviewedAt?: Date;
  };
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name:      { type: String, required: true },
  category:  { type: String, default: '' },
  qty:       { type: Number, required: true },
  price:     { type: Number, required: true },
  size:      { type: String, default: '' },
  color:     { type: String, default: '' },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId:       { type: String, required: true, unique: true },
    customer: {
      firstName: String, lastName: String,
      email: String,     phone: String,
      address: String,   city: String,
      state: String,     zip: String,
      country: { type: String, default: 'Pakistan' },
    },
    items:         { type: [OrderItemSchema], required: true },
    subtotal:      { type: Number, required: true },
    discount:      { type: Number, default: 0 },
    total:         { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'card', 'bank'], default: 'COD' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'],       default: 'unpaid' },
    status:        { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending' },
    bankTransfer: {
      uploadToken:    { type: String, default: '' },
      transactionId:  { type: String, default: '' },
      proofUrl:       { type: String, default: '' },
      submittedAt:    { type: Date },
      status:         { type: String, enum: ['awaiting_proof', 'proof_submitted', 'approved', 'rejected'] },
      reviewedAt:     { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);
