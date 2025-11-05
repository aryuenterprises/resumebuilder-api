import { Router } from "express";
import{fetchPaymentIntent, paymentUpdate, getPaymentRecord} from '../Controller/payment';

const paymentRouter=Router();
paymentRouter.post('/create-payment-intent',fetchPaymentIntent);
paymentRouter.post('/update-payment-intent',paymentUpdate);
paymentRouter.get('/payment-records',getPaymentRecord);
export default paymentRouter;