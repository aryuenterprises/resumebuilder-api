import { Router } from "express";
import {createPlanSubscription,
    getPlanSubscription,
    editPlanSubscription,
    deletePlanSubscription} from '../Controller/planSubscription';
const planSubscriptionRouter = Router();
planSubscriptionRouter.post('/create', createPlanSubscription);
planSubscriptionRouter.get('/get-all-plan-subscription', getPlanSubscription);
planSubscriptionRouter.put('/edit/:id', editPlanSubscription);
planSubscriptionRouter.delete('/delete/:id', deletePlanSubscription);
export default planSubscriptionRouter;