import {Router} from 'express';
import {createEducation, updateEducation, getEducationById, getEducation } from '../Controller/educationResume';
const educationRouter = Router();
educationRouter.post('/create', createEducation);
educationRouter.post('/update', updateEducation);
educationRouter.get('/get-education/:id', getEducationById);
educationRouter.get('/get-all-education', getEducation);
export default educationRouter;