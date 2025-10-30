import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  description?: string;
  designFiles: string[]; // file paths or URLs
  placeholders: string[]; // e.g. ['{{name}}', '{{email}}']
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    designFiles: [String],
    placeholders: [String]
  },
  { timestamps: true }
);

export default mongoose.model<ITemplate>('Template', TemplateSchema);
