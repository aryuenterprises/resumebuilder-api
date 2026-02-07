import express from "express";
import { createOrder, verifyAndUpdatePayment,markPaymentFailed } from "../Controller/PaymentRazor";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyAndUpdatePayment);
router.post("/payment-failed", markPaymentFailed);


export default router;
