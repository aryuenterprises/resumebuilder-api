import mongoose, { Schema } from "mongoose";
const SummarySchema = new Schema({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'ContactResume',
        required: true,
    },
    templateId: { type: String, required: false },
    text: {
        type: String,
        required: false,
    },
}, { timestamps: true });
export const Summary = mongoose.model('Summary', SummarySchema);
