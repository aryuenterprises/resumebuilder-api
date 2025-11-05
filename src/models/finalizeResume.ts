import { getFinalizeResume } from 'Controller/finalizeResume';
import { Schema, model, Document, Types } from 'mongoose';

export interface IFinalizeResume extends Document {
  contactId: Types.ObjectId;
  templateId?:string;
  skillsData: {
    languages: { name: string; level: string }[];
    certificationsAndLicenses: string[];
    hobbiesAndInterests: string[];
    awardsAndHonors: string[];
    websitesAndSocialMedia: { websiteUrl: string; socialMedia: string }[];
    references: string[];
    customSection: { name: string; description: string }[];
  };
}

const FinalizeResumeSchema = new Schema<IFinalizeResume>({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'ContactResume',
    required: true,
  },
  templateId:{
    type:String,
    required:false,
  },
  skillsData: {
    languages: [
      {
        name: { type: String, required: false },
        level: { type: String, required: false },
      },
    ],
    certificationsAndLicenses: [
      {
        name: { type: String, required: false },
      }
    ],
    hobbiesAndInterests: [
      {
        name: { type: String, required: false },
      },
    ],
    awardsAndHonors: [
      {
        name: { type: String, required: false },
      },
    ],
    websitesAndSocialMedia: [
      {
        websiteUrl: { type: String, required: false },
        socialMedia: { type: String, required: false },
      },
    ],
    references: [
      {
        name: { type: String, required: false },
      },
    ],
    customSection: [
      {
        name: { type: String, required: false },
        description: { type: String, required: false },
      },
    ],
  },
}, { timestamps: true });

export const FinalizeResume = model<IFinalizeResume>(
  'FinalizeResume',
  FinalizeResumeSchema
);
