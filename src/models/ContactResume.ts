import { Schema, model, Document, Types } from "mongoose";

export interface IContactResume extends Document {
    userId: Types.ObjectId;
    firstName: string;
    lastName: string;
    jobTitle: string;
    keywords: string[];
    tones: string[];
    phone: string;
    email: string;
    country: string;
    city: string;
    address: string;
    postCode: string;
}

const ContactResumeSchema = new Schema<IContactResume>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: [true, "First Name is required"] },
    lastName: { type: String, required: [true, "Last Name is required"] },
    email: { type: String, required: [true, "Email is required"] },
    jobTitle: { type: String, required: [true, "Job Title is required"] },
    keywords: { type: [String], required: [true, "Keywords is required"] },
    tones: { type: [String], required: [true, "Tones is required"] },
    phone: { type: String, required: [true, "Phone is required"] },
    country: { type: String, required: [true, "Country is required"] },
    city: { type: String, required: [true, "City is required"] },
    address: { type: String, required: [true, "Address is required"] },
    postCode: { type: String, required: [true, "Post Code is required"] },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const ContactResume = model<IContactResume>("ContactResume", ContactResumeSchema);