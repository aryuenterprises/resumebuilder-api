import { Router } from "express";
import {createSkill, updateSkill, getSkillById, getSkill } from "../Controller/skillsResume";
const skillResumeRouter = Router();
skillResumeRouter.post("/create", createSkill);
skillResumeRouter.post("/update", updateSkill);
skillResumeRouter.get("/get-skill/:id", getSkillById);
skillResumeRouter.get("/get-all-skill", getSkill);
export default skillResumeRouter;