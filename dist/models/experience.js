import { Schema, model } from 'mongoose';
const ExperienceDetailSchema = new Schema({
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
const ExperienceSchema = new Schema({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'ContactResume',
        required: true,
    },
    templateId: { type: String, required: false },
    experiences: [ExperienceDetailSchema]
}, { timestamps: true });
export const Experience = model('Experience', ExperienceSchema);
