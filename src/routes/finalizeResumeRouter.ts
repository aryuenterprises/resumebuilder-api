import { Router } from "express";
import { createFinalizeResume, updateFinalizeResume, getFinalizeResumeById, getFinalizeResume } from "../Controller/finalizeResume";
const finalizeResumeRouter = Router();
finalizeResumeRouter.post('/create', createFinalizeResume);
finalizeResumeRouter.post('/update', updateFinalizeResume);
// finalizeResumeRouter.post('/update-all', updateFinalizeResume);
finalizeResumeRouter.get('/get-finalize-resume/:id', getFinalizeResumeById);
finalizeResumeRouter.get('/get-all-finalize-resume', getFinalizeResume);
export default finalizeResumeRouter;