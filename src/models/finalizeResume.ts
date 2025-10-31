import { Schema, model, Document, Types } from 'mongoose';

export interface IFinalizeResume extends Document {
  contactId: Types.ObjectId;
  languages: { language: string; skill: string }[];
  certificationsAndLicenses: string;
  hobbiesAndInterests: string[];
  awardsAndHonors: string;
  websitesAndSocialMedia: { websiteUrl: string; socialMedia: string }[];
  references: string;
  customSection: { sectionName: string; description: string }[];
}

const FinalizeResumeSchema = new Schema<IFinalizeResume>({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'ContactResume',
    required: true,
  },
  languages: [
    {
      language: { type: String, required: true },
      skill: { type: String, required: true },
    },
  ],
  certificationsAndLicenses: {
    type: String,
    required: true,
  },
  hobbiesAndInterests: [
    {
      type: String,
      required: true,
    },
  ],
  awardsAndHonors: {
    type: String,
    required: true,
  },
  websitesAndSocialMedia: [
    {
      websiteUrl: { type: String, required: true },
      socialMedia: { type: String, required: true },
    },
  ],
  references: {
    type: String,
    required: true,
  },
  customSection: [
    {
      sectionName: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
});

export const FinalizeResume = model<IFinalizeResume>('FinalizeResume', FinalizeResumeSchema);
