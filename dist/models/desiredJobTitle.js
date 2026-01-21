import { Schema, model } from "mongoose";
const DesiredJobTitleSchema = new Schema({
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
}, { timestamps: true });
export const DesiredJobTitle = model("DesiredJobTitle", DesiredJobTitleSchema);
