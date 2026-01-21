import { Schema, model, Document, Types } from "mongoose";

export interface ITone extends Document {
  desiredJobTitle: Types.ObjectId;
  keywords: [];
  tones: [];
  status: String;
}

const ToneSchema = new Schema<ITone>(
  {
    desiredJobTitle: {
      type: Schema.Types.ObjectId,
      ref: "DesiredJobTitle",
      required: true,
    },
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

export const Tone = model<ITone>("Tone", ToneSchema);
