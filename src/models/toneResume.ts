import { Schema, model, Document } from 'mongoose';

export interface ITone extends Document {
    name: string;
    status: String;
}

const ToneSchema = new Schema<ITone>(
    {
        name: { type: String, required: true },
        status: { type: String, default:'1' },
    },
    { timestamps: true }
);

export const Tone = model<ITone>(
    'Tone',
    ToneSchema
);
