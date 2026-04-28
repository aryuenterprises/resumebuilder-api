import { Request, Response } from "express";
import { ProjectResume } from "../models/projectResume";

const getProjectResumeById = async(req:Request, res:Response)=>{
    try{
        const {id} = req.params;
        const projectResume = await ProjectResume.findOne({contactId:id});
        if(!projectResume){
            return res.status(404).json({message:"Project resume not found"});
        }
        return res.status(201).json({
                message: "Project resume created successfully",
                data: projectResume,
            });
    }catch(error:any){
        res
        .status(500)
        .json({ message: "Error updating experience", error: error.message });
    }
}

const updateProjectResume = async (req: Request, res: Response) => {
    try {
        const { id, contactId } = req.query;
        const { projects } = req.body;
        let existingProject;
        if (id) {
            existingProject = await ProjectResume.findOne({ _id: id });
        } else {
            existingProject = await ProjectResume.findOne({ contactId: contactId });   
        }
        if(!existingProject){
            const newProjectResume = new ProjectResume({ contactId, projects });
            await newProjectResume.save();
            return res.status(201).json({
                message: "Project resume created successfully",
                projectResume: newProjectResume,
            });
        }

        existingProject.projects = projects;
        await existingProject.save();
        res.json({
            message: "Project resume updated successfully",
            projectResume: existingProject,
        });
           


       
    } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating experience", error: error.message });
  }
};

export { updateProjectResume, getProjectResumeById };