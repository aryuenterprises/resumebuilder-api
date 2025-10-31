import mongoose, {Document, Schema} from "mongoose";
export interface ISummary extends Document {
    contactId: mongoose.Types.ObjectId;
    summary: string;
}

const SummarySchema = new Schema<ISummary>({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'ContactResume',
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Summary = mongoose.model<ISummary>('Summary', SummarySchema);