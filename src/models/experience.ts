import {Schema, model, Document, Types} from 'mongoose';

interface IExperienceDetail {
    jobTitle: string;
    employer: string;
    location: string;
    startDate: Date;
    endDate?: string;
    text?: string;
}

export interface IExperience extends Document {
    contactId: Types.ObjectId;
    templateId: string;
    experiences: IExperienceDetail[];
}

const ExperienceDetailSchema = new Schema<IExperienceDetail>({
    jobTitle: {
        type: String,
        required: false,
    },
    employer: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    startDate: {
        type: Date,
        required: false,
    },
    endDate: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: false,
    },
});

const ExperienceSchema = new Schema<IExperience>({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'ContactResume',
        required: true,
    },
    templateId: { type: String, required: false },
    experiences: [ExperienceDetailSchema]
}, { timestamps: true });

export const Experience = model<IExperience>('Experience', ExperienceSchema);