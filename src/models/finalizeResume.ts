import { getFinalizeResume } from 'Controller/finalizeResume';
import { Schema, model, Document, Types } from 'mongoose';

export interface IFinalizeResume extends Document {
  contactId: Types.ObjectId;
  globalSkillsData: {
    languages: { language: string; skill: string }[];
    certificationsAndLicenses: string;
    hobbiesAndInterests: string[];
    awardsAndHonors: string;
    websitesAndSocialMedia: { websiteUrl: string; socialMedia: string }[];
    references: string;
    customSection: { sectionName: string; description: string }[];
  };
}

const FinalizeResumeSchema = new Schema<IFinalizeResume>({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'ContactResume',
    required: true,
  },
  globalSkillsData: {
    languages: [
      {
        language: { type: String, required: false },
        skill: { type: String, required: false },
      },
    ],
    certificationsAndLicenses: {
      type: String,
      required: false,
    },
    hobbiesAndInterests: [
      {
        type: String,
        required: false,
      },
    ],
    awardsAndHonors: {
      type: String,
      required: false,
    },
    websitesAndSocialMedia: [
      {
        websiteUrl: { type: String, required: false },
        socialMedia: { type: String, required: false },
      },
    ],
    references: {
      type: String,
      required: false,
    },
    customSection: [
      {
        sectionName: { type: String, required: false },
        description: { type: String, required: false },
      },
    ],
  },
}, { timestamps: true });

export const FinalizeResume = model<IFinalizeResume>(
  'FinalizeResume',
  FinalizeResumeSchema
);
