import { Schema, model } from "mongoose";
const PlanSubscriptionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    order: {
        type: String
    },
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const PlanSubscription = model("PlanSubscription", PlanSubscriptionSchema);
