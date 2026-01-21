import { Schema, model } from 'mongoose';
const KeyboardSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String, default: '1' },
}, { timestamps: true });
export const Keyboard = model('Keyboard', KeyboardSchema);
