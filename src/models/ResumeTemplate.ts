import {Schema, model, Types} from "mongoose";
export interface IResumeTemplate{
    name: string;
    status: string;
}

const ResumeTemplateSchema=new Schema<IResumeTemplate>(
    {
        name:{type:String,required:true},
        status:{type:String,default:'1'},
    },
    {timestamps:true}
);

export const ResumeTemplate=model<IResumeTemplate>('ResumeTemplate',ResumeTemplateSchema);