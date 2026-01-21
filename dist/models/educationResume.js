import { Schema, model } from 'mongoose';
const EducationDetailSchema = new Schema({
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
const EducationSchema = new Schema({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'ContactResume',
        required: true,
    },
    templateId: { type: String, required: false },
    education: [EducationDetailSchema]
}, { timestamps: true });
export const Education = model('Education', EducationSchema);
