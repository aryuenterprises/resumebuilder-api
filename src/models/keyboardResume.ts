import { Schema, model, Document } from 'mongoose';

export interface IKeyboard extends Document {
    name: string;
    status: String;
}

const KeyboardSchema = new Schema<IKeyboard>(
    {
        name: { type: String, required: true },
        status: { type: String, default:'1' },
    },
    { timestamps: true }
);

export const Keyboard = model<IKeyboard>(
    'Keyboard',
    KeyboardSchema
);
