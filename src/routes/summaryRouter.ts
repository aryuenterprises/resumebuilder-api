import {Router} from 'express';
import {createSummary, updateSummary, getSummaryById, getSummary} from '../Controller/summary';
const summaryRouter = Router();
summaryRouter.post('/create', createSummary);
summaryRouter.put('/update/:id', updateSummary);
summaryRouter.get('/get-summary/:id', getSummaryById);
summaryRouter.get('/get-all-summary', getSummary);
export default summaryRouter;