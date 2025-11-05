import {Schema, model, Document, Types} from 'mongoose';

interface IEducationDetail {
    schoolname: string;
    location: string;
    degree: string;
    startDate: number;
    endDate?: number;
    text?: string;
}

export interface IEducation extends Document {
    contactId: Types.ObjectId;
    templateId: string;
    education: IEducationDetail[];
}

const EducationDetailSchema = new Schema<IEducationDetail>({
    schoolname: {
        type: String,
        required: false,
    },
   
    location: {
        type: String,
        required: false,
    },
    degree: {
        type: String,
        required: false,
    },
    startDate: {
        type: Number,
        required: false,
    },
    endDate: {
        type: Number,
        required: false,
    },
    text: {
        type: String,
        required: false,
    },
});

const EducationSchema = new Schema<IEducation>({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'ContactResume',
        required: true,
    },
    templateId: { type: String, required: false },
    education: [EducationDetailSchema]
}, { timestamps: true });

export const Education = model<IEducation>('Education', EducationSchema);