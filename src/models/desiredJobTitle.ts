import { Schema, model, Document } from 'mongoose';

export interface IDesiredJobTitle extends Document {
    name: string;
    status: String;
}

const DesiredJobTitleSchema = new Schema<IDesiredJobTitle>(
    {
        name: { type: String, required: true },
        status: { type: String, default:'1' },
    },
    { timestamps: true }
);

export const DesiredJobTitle = model<IDesiredJobTitle>(
    'DesiredJobTitle',
    DesiredJobTitleSchema
);
