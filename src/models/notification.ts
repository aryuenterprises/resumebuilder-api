import { Schema, model, Document } from "mongoose";

export interface INotification extends Document {
  to: string;
  subject?: string;
  message?: string;
  name?: string;
  template?: string;
  status?: "pending" | "sent" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
   sentAt?: Date;
}

const notificationSchema = new Schema<INotification>({
  to: { type: String, required: true },
  subject: { type: String, default: "Default Subject" },
  message: { type: String, default: "This is a default message." },
  name: { type: String, default: "Your Company" },
  template: { type: String, default: "default" },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending"
  },
    sentAt: { type: Date },
}, { timestamps: true });

const Notification = model<INotification>("Notification", notificationSchema);
export default Notification;
