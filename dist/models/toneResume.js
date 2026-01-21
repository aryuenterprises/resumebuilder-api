import { Schema, model } from "mongoose";
const ToneSchema = new Schema({
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
}, { timestamps: true });
export const Tone = model("Tone", ToneSchema);
