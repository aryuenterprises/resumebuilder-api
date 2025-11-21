import { Schema, model, Document, Types } from "mongoose";
export interface IPlanSubscription extends Document {
  name: string;
  description: string;
  plan: string;
  price: number;
  order: string;
  status: string;
}

const PlanSubscriptionSchema = new Schema<IPlanSubscription>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    plan:{
      type:String,
      required:true,
    },
    price: {
      type: Number,
      required: true,
    },
    order:{
      type:String
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const PlanSubscription = model<IPlanSubscription>(
  "PlanSubscription",
  PlanSubscriptionSchema
);
