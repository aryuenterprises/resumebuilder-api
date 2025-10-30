import {Schema, model, Document, Types} from 'mongoose';

interface IEducationDetail {
    schoolName: string;
    location: string;
    degree: string;
    startYear: number;
    endYear?: number;
    description?: string;
}

export interface IEducation extends Document {
    contactId: Types.ObjectId;
    education: IEducationDetail[];
}

const EducationDetailSchema = new Schema<IEducationDetail>({
    schoolName: {
        type: String,
        required: true,
    },
   
    location: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    startYear: {
        type: Number,
        required: true,
    },
    endYear: {
        type: Number,
        required: false,
    },
    description: {
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
    education: [EducationDetailSchema]
}, { timestamps: true });

export const Education = model<IEducation>('Education', EducationSchema);