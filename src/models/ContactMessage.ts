import mongoose, { Document, Schema } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const ContactMessageSchema: Schema<IContactMessage> = new Schema(
  {
    name: { type: String, required: [true,"Name is required"] },
    email: { type: String, required: [true,"Email is required" ]},
    message: { type: String, required: [true,"Message is required"] }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
