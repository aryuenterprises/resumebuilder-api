import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  paymentId: string;
  amount: number;
  currency: string;
  email?: string;
  clientSecret?: string;
  status: string;
  paymentDetails?: {
    type?: string;
    brand?: string;
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
    fingerprint?: string;
    email?: string;
  };
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: false, unique: true },
    amount: { type: Number, required: false },
    currency: { type: String, required: false },
    email: { type: String },
    clientSecret: { type: String },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
    paymentDetails: {
      type: {
        type: String,
      },
      brand: String,
      last4: String,
      expiryMonth: Number,
      expiryYear: Number,
      fingerprint: String,
      email: String,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
