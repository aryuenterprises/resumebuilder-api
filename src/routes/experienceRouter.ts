import {Router} from 'express';
import {createExperience, updateExperience} from '../Controller/experience';
const experienceRouter = Router();
experienceRouter.post('/create', createExperience);
experienceRouter.put('/update/:id', updateExperience);
export default experienceRouter;