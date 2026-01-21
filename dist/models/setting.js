import { Schema, model } from "mongoose";
const SettingSchema = new Schema({
    PublishableKey: { type: String, required: [false, "PublishableKey is required"] },
    SecretKey: { type: String, required: [false, "SecretKey is required"] },
    logoImage: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    currenyType: {
        type: String,
        required: false,
    },
    currencyName: { type: String, required: false },
    //smtp
    host: { type: String, required: false },
    port: { type: Number, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    fromName: { type: String, required: false },
}, { timestamps: { createdAt: true, updatedAt: false } });
export const setting = model("Setting", SettingSchema);
