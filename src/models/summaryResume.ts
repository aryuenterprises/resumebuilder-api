import mongoose, {Document, Schema} from "mongoose";
export interface ISummary extends Document {
    contactId: mongoose.Types.ObjectId;
    templateId: string;
    text: string;
}

const SummarySchema = new Schema<ISummary>({
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

export const Summary = mongoose.model<ISummary>('Summary', SummarySchema);