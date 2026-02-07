import { Request, Response } from "express";
import mongoose from "mongoose";
import PaymentRazor from "../models/paymentRazorModel";
import { razorpay, createRazorpayOrder } from "../services/razorpayService";
import { verifyRazorpaySignature } from "../utils/verifySignature";


const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, planId, amount } = req.body;

    if (!userId || !planId || !amount) {
      return res.status(400).json({ message: "userId, planId and amount are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ message: "Invalid userId or planId" });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const order = await createRazorpayOrder(numericAmount);

    await PaymentRazor.create({
      userId,
      planId,
      orderId: order.id,
      amount: numericAmount,
      currency: order.currency,
      status: "created",
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
};


const verifyAndUpdatePayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const existingPayment = await PaymentRazor.findOne({ orderId: razorpay_order_id });

    if (!existingPayment) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (existingPayment.status === "paid") {
      return res.status(200).json({ success: true, message: "Payment already verified" });
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      existingPayment.status = "failed";
      await existingPayment.save();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);


    if (paymentDetails.amount !== existingPayment.amount * 100) {
      return res.status(400).json({ message: "Amount mismatch" });
    }

    await PaymentRazor.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        $set: {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: "paid",
          method: paymentDetails.method,
          bank: paymentDetails.bank,
          wallet: paymentDetails.wallet,
          email: paymentDetails.email,
          contact: paymentDetails.contact,
          metadata: paymentDetails,
        },
      }
    );

    res.status(200).json({ success: true, message: "Payment verified & updated" });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

const markPaymentFailed = async (req: Request, res: Response) => {
  try {
    const { orderId, paymentId, reason } = req.body;

    await PaymentRazor.findOneAndUpdate(
      { orderId },
      {
        status: "failed",
        paymentId,
        metadata: { failureReason: reason },
      }
    );

    res.status(200).json({ message: "Payment marked as failed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment status" });
  }
};



export {
    createOrder,
    verifyAndUpdatePayment,
    markPaymentFailed
}
