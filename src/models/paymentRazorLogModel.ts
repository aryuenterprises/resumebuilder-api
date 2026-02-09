import mongoose,{ Schema, Types, Document } from "mongoose";

export interface IPaymentRazorLog extends Document {
    userId: Types.ObjectId;
    planId: Types.ObjectId;
    orderId: string;
    paymentId?: string;
    signature?: string;
    amount: number;
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

const paymentRazorLogSchema = new Schema<IPaymentRazorLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "planSubscription", required: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: String,
    signature: String,
    amount: { type: Number, required: true },
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

export default mongoose.model<IPaymentRazorLog>("PaymentRazorLog", paymentRazorLogSchema);