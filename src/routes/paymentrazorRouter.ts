import express from "express";
import { createOrder, verifyAndUpdatePayment,markPaymentFailed,freePlan } from "../Controller/PaymentRazor";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyAndUpdatePayment);
router.post("/payment-failed", markPaymentFailed);
router.post("/free-plan", freePlan);


export default router;
