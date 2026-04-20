import {Schema, model, Document, Types} from "mongoose";

export interface IProjectResume extends Document {
    contactId: Types.ObjectId;
    projects: {
        title: string;
        techStack: string[];
        liveUrl: string;
        githubUrl: string;
        description: string;
    }[];
}

const ProjectResumeSchema = new Schema<IProjectResume>({
    contactId: { type: Schema.Types.ObjectId, ref: "ContactResume", required: true },
    projects: [{
        title: { type: String},
        techStack: [{ type: String }],
        liveUrl: { type: String },

        githubUrl: { type: String },
        description: { type: String }
    }]
}, { timestamps: true });

export const ProjectResume = model<IProjectResume>("ProjectResume", ProjectResumeSchema);
