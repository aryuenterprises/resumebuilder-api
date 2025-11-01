import { Router } from "express";
import { createContactResume, getContactResume, updateResume, getAllContactResume } from "../Controller/contactResume";
const contactResumeRouter = Router();
contactResumeRouter.post("/create", createContactResume);
contactResumeRouter.post("/update", updateResume);
contactResumeRouter.get("/get-contact/:id", getContactResume);
contactResumeRouter.get("/get-all-contact", getAllContactResume);
export default contactResumeRouter;
