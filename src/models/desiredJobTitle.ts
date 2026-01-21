import { Schema, model, Document } from "mongoose";

export interface IDesiredJobTitle extends Document {
  name: string;
  keywords: [];
  tones: [];
  status: String;
}

const DesiredJobTitleSchema = new Schema<IDesiredJobTitle>(
  {
    name: { type: String, required: true },
    keywords: {
      type: [String],
      default: [],
    },
    tones: {
      type: [String],
      default: [],
    },
    status: { type: String, default: "1" },
  },
  { timestamps: true }
);

export const DesiredJobTitle = model<IDesiredJobTitle>(
  "DesiredJobTitle",
  DesiredJobTitleSchema
);
