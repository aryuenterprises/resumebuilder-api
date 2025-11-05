import { Router } from "express";
import{createResumeTemplate,
    getResumeTemplate,
    editResumeTemplate,
    deleteResumeTemplate} from '../Controller/ResumeTemplate';

const resumeTemplateRouter=Router();

resumeTemplateRouter.post('/create',createResumeTemplate);
resumeTemplateRouter.get('/resume-templates',getResumeTemplate);
resumeTemplateRouter.put('/edit/:id',editResumeTemplate);
resumeTemplateRouter.delete('/delete/:id',deleteResumeTemplate);
export default resumeTemplateRouter;