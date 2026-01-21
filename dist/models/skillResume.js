import { Schema, model } from 'mongoose';
const SkillDetailSchema = new Schema({
    skill: {
        type: String,
        required: false,
    },
    level: {
        type: String,
        required: false,
    }
});
const SkillSchema = new Schema({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'ContactResume',
        required: true,
    },
    templateId: { type: String, required: false },
    skills: [SkillDetailSchema]
}, { timestamps: true });
export const Skill = model('Skill', SkillSchema);
