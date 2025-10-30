import mongoose, { Schema } from 'mongoose';
const ContactMessageSchema = new Schema({
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    message: { type: String, required: [true, "Message is required"] }
}, { timestamps: { createdAt: true, updatedAt: false } });
export default mongoose.model('ContactMessage', ContactMessageSchema);
