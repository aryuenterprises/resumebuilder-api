import { Schema, model } from "mongoose";
const notificationSchema = new Schema({
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
const Notification = model("Notification", notificationSchema);
export default Notification;
