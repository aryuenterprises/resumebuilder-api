import mongoose, { Schema } from 'mongoose';
const TemplateSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    designFiles: [String],
    placeholders: [String]
}, { timestamps: true });
export default mongoose.model('Template', TemplateSchema);
