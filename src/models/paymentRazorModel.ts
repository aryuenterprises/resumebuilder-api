import mongoose, { Schema, Types, Document } from "mongoose";

export interface IPaymentRazor extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  orderId: string;
  paymentId?: string;
  signature?: string;
  amount: number; // stored in rupees
  currency: string;
  status: "created" | "paid" | "failed";
  metadata?: Record<string, any>;
  method?: string;
  bank?: string;
  wallet?: string;
  email?: string;
  contact?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentRazorSchema = new Schema<IPaymentRazor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "planSubscription", required: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: String,
    signature: String,
    amount: { type: Number, required: true }, // rupees
    currency: { type: String, default: "INR", required: true },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      required: true,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    method: String,
    bank: String,
    wallet: String,
    email: String,
    contact: String,
  },
  { timestamps: true }
);

export default mongoose.model<IPaymentRazor>("PaymentRazor", paymentRazorSchema);
