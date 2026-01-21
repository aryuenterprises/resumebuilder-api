import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPayment extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  paymentId: string;
  templateId: string;
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "PlanSubscription",
      required: true,
    },
    paymentId: { type: String, required: false, unique: false },
    templateId: { type: String, required: false },
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

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
