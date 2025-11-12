import { Schema, model, Document, Types } from "mongoose";

export interface ISetting extends Document {
  PublishableKey: string;
  SecretKey: string;
}

const SettingSchema = new Schema<ISetting>(
  {
    PublishableKey: { type: String, required: [true, "PublishableKey is required"] },
    SecretKey: { type: String, required: [true, "SecretKey is required"] },
   
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const setting = model<ISetting>(
  "Setting",
  SettingSchema
);
