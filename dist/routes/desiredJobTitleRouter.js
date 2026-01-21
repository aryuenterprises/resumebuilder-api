import { Router } from 'express';
import { createDesiredJobTitle, getDesiredJobTitle, editDesiredJobTitle, deleteDesiredJobTitle } from '../Controller/desiredJobTitle';
const desiredJobTitleRouter = Router();
desiredJobTitleRouter.post('/create', createDesiredJobTitle);
desiredJobTitleRouter.get('/desired-job-title', getDesiredJobTitle);
desiredJobTitleRouter.put('/edit/:id', editDesiredJobTitle);
desiredJobTitleRouter.delete('/delete/:id', deleteDesiredJobTitle);
export default desiredJobTitleRouter;
