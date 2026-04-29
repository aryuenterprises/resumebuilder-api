import {Schema, model, Document, Types} from 'mongoose';

interface ISkillDetail {
    // name: string;
    // title:string;
    // skills: string[]
    text: string
    
}

export interface ISkill extends Document {
    contactId: Types.ObjectId;
    templateId: string;
    text: string;
    // skills: ISkillDetail[];
    // title: string;
    // name:string;
    
}

// const SkillDetailSchema = new Schema<ISkillDetail>({
//     // name: {
//     //     type: String,
//     //     required: false,
//     // },
//     // title: {
//     //     type: String,
//     //     required: false,
//     // },
//     // skills:[
//     //     {
//     //         name: {
//     //             type: String,
//     //             required: false,
//     //         },
//     //     }
//     // ]
//     text: {
//         type: String,
//         required: false,
//     },
   
   
// });

const SkillSchema = new Schema<ISkill>({
    contactId: {
        type: Schema.Types.ObjectId,
        ref: 'ContactResume',
        required: true,
    },
    templateId: { type: String, required: false },
    text: {
        type: String,
        required: false,
    }
}, { timestamps: true });

export const Skill = model<ISkill>('Skill', SkillSchema);