import { Schema, model, Document, Types } from "mongoose";
export interface IPlanSubscription extends Document {
  desiredJobTitle: Types.ObjectId;
  price: number;
  status: string;
}

const PlanSubscriptionSchema = new Schema<IPlanSubscription>(
  {
    desiredJobTitle: {
      type: Schema.Types.ObjectId,
      ref: "DesiredJobTitle",
      required: true,
    },
    price: {
      type: Number,
      required: true,
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
