import { Schema, model } from "mongoose";
const ResumeTemplateSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String, default: '1' },
}, { timestamps: true });
export const ResumeTemplate = model('ResumeTemplate', ResumeTemplateSchema);
