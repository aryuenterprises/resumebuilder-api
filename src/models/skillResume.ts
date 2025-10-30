import {Schema, model, Document, Types} from 'mongoose';

interface ISkillDetail {
    skill: string;
    level: string;
    
}

export interface ISkill extends Document {
    contactId: Types.ObjectId;
    skills: ISkillDetail[];
}

const SkillDetailSchema = new Schema<ISkillDetail>({
    skill: {
        type: String,
        required: true,
    },
   
    level: {
        type: String,
        required: true,
    }
});

const SkillSchema = new Schema<ISkill>({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'ContactResume',
        required: true,
    },
    skills: [SkillDetailSchema]
}, { timestamps: true });

export const Skill = model<ISkill>('Skill', SkillSchema);