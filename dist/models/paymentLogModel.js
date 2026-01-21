import mongoose, { Schema } from "mongoose";
const paymentSchema = new Schema({
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
}, { timestamps: true });
export const PaymentLog = mongoose.model("PaymentLog", paymentSchema);
