import { Router } from "express";
import { updateProjectResume, getProjectResumeById } from "../Controller/project";
const projectRouter = Router();
projectRouter.post("/update", updateProjectResume);
projectRouter.get("/get-project-resume/:id", getProjectResumeById);
export default projectRouter;
