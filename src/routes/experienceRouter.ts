import {Router} from 'express';
import {getAllContacts,createExperience, updateExperience, getExperienceById} from '../Controller/experience';
const experienceRouter = Router();
experienceRouter.post('/create', createExperience);
experienceRouter.post('/update', updateExperience);
experienceRouter.get('/get-experience/:id', getExperienceById);
experienceRouter.get('/get-all-contacts/:id', getAllContacts);
export default experienceRouter;