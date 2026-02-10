import { Schema, model, Document, Types } from "mongoose";

export interface IContactResume extends Document {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  photo: string;
  templateId: string;
  jobTitle: string;
  keywords: string[];
  tones: string[];
  phone: string;
  email: string;
  country: string;
  city: string;
  address: string;
  postCode: string;
  linkedIn: string;
  portfolio: string;
  resume: string;
  resumeStatus: string;

}

const ContactResumeSchema = new Schema<IContactResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: [false, "First Name is required"] },
    lastName: { type: String, required: [false, "Last Name is required"] },
    photo: { type: String, required: false },
    templateId: { type: String, required: [false, "Template is required"] },
    email: { type: String, required: [false, "Email is required"] },
    // jobTitle: {
    //   type: Schema.Types.ObjectId,
    //   ref: "DesiredJobTitle",
    //   required: false,
    // },
    jobTitle: { type: String, required: [false, "Job Title is required"] },
    keywords: { type: [String], required: [false, "Keywords is required"] },
    tones: { type: [String], required: [false, "Tones is required"] },
    phone: { type: String, required: [false, "Phone is required"] },
    country: { type: String, required: [false, "Country is required"] },
    city: { type: String, required: [false, "City is required"] },
    address: { type: String, required: [false, "Address is required"] },
    postCode: { type: String, required: [false, "Post Code is required"] },
    linkedIn: { type: String, required: false },
    portfolio: { type: String, required: false },
    resume: { type: String, required: false },
    resumeStatus:{
      type:String,
      default:'pending'
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ContactResume = model<IContactResume>(
  "ContactResume",
  ContactResumeSchema
);
