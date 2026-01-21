import { Router } from "express";
import { freePlan, fetchPaymentIntent, paymentUpdate, getPaymentRecord } from '../Controller/payment';
const paymentRouter = Router();
paymentRouter.post('/create-payment-intent', fetchPaymentIntent);
paymentRouter.post('/update-payment-intent', paymentUpdate);
paymentRouter.get('/payment-records', getPaymentRecord);
paymentRouter.post('/free-plan', freePlan);
export default paymentRouter;
