import { Request, Response } from 'express';
import Stripe from 'stripe';
import {Payment} from '../models/paymentModel'; // ✅ Adjust path as needed

// const fetchPaymentIntent = async (req: Request, res: Response) => {
//   try {
//     const { amount,metadata, userId,planId, ...paymentDetails } = req.body;

//     // Validate required fields
//     if (!amount) {
//       return res.status(400).json({
//         error: "Amount and currency are required fields",
//       });
//     }

//     const secretKey = process.env.Secret_key;
//     console.log("Stripe Secret Key:", secretKey);
//     if (!secretKey) {
//       return res.status(500).json({
//         error: "Stripe secret key not configured",
//       });
//     }

//     const stripeInstance = new Stripe(secretKey);
//     console.log("Stripe instance created", stripeInstance);
//     // Create payment intent
//     const paymentIntent = await stripeInstance.paymentIntents.create({
//       amount: Math.round(amount),
//       currency: 'inr',
//       metadata:{
//         user_email:"barathkrishnamoorthy17@gmail.com"
//       },
//     description: 'Payment for Resume Builder Service',
//       automatic_payment_methods: {
//         enabled: true,
//         allow_redirects: "never",
//       },
//     });
//     console.log("Payment Intent created:", paymentIntent);

//     // Create and save payment record
//     const payment = new Payment({
//       userId:userId,
//       planId:planId,
//       paymentId: paymentIntent.id,
//       amount: paymentIntent.amount,
//     //   currency: paymentIntent.currency,
//       email: paymentDetails.email,
//       clientSecret: paymentIntent.client_secret,
//       status: 'pending',
//     });

//     await payment.save();

//     return res.status(200).json({
//       paymentId: payment._id,
//       clientSecret: paymentIntent.client_secret,
//       message: "PaymentIntent created successfully",
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     return res.status(500).json({
//       error: "Unable to initiate payment. Please try again.",
//     });
//   }
// };

// const paymentUpdate = async (req: Request, res: Response) => {
//   try {
//     const { paymentIntent,planId } = req.body;

//     const secretKey = process.env.Secret_key;
//     if (!secretKey) {
//       return res.status(500).json({ error: "Stripe secret key not configured" });
//     }

//     const stripe = new Stripe(secretKey);

//     if (paymentIntent.status === "succeeded") {
//       const paymentMethod = await stripe.paymentMethods.retrieve(
//         paymentIntent.payment_method
//       );

//       let paymentDetails: Record<string, any> = {};

//       if (paymentMethod.type === "card" && paymentMethod.card) {
//         paymentDetails = {
//           type: "card",
//           brand: paymentMethod.card.brand,
//           last4: paymentMethod.card.last4,
//           expiryMonth: paymentMethod.card.exp_month,
//           expiryYear: paymentMethod.card.exp_year,
//           fingerprint: paymentMethod.card.fingerprint,
//         };
//       } else if (paymentMethod.type === "link" && paymentMethod.link) {
//         paymentDetails = {
//           type: "link",
//           email: paymentMethod.link.email,
//         };
//       } else if (paymentMethod.type === "paynow") {
//         paymentDetails = { type: "paynow" };
//       }

//       const updatedPayment = await Payment.findOneAndUpdate(
//         { paymentId: paymentIntent.id },
//         {
//           status: paymentIntent.status,
//           planId:planId,
//           paymentDetails,
//         },
//         { new: true }
//       );
//       console.log("Updated Payment Record:", updatedPayment);
//       if (!updatedPayment) {
//         return res.status(404).json({ error: "Payment record not found" });
//       }

//       return res.status(200).json({
//         message: "Payment updated successfully",
//         payment: updatedPayment,
//       });
//     }

//     return res.status(400).json({
//       message: "Payment not completed or invalid status",
//     });
//   } catch (error) {
//     console.error("Error updating payment:", error);
//     return res.status(500).json({
//       error: "Unable to update payment. Please try again.",
//     });
//   }
// };


// ===================== CREATE PAYMENT INTENT =====================
const fetchPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, metadata, userId, planId, ...paymentDetails } = req.body;

    if (!amount || !userId || !planId) {
      return res.status(400).json({ error: "Amount, userId, and planId are required" });
    }

    const secretKey = process.env.Secret_key;
    if (!secretKey) {
      return res.status(500).json({ error: "Stripe secret key not configured" });
    }

    const stripe = new Stripe(secretKey);

    // ✅ Step 1: Find existing payment for this user (ignore planId)
    let payment = await Payment.findOne({ userId });

    // ✅ Step 2: If succeeded, we can update plan and create new intent
    let paymentIntent;

    if (payment && payment.paymentId && payment.status === "pending") {
      // Reuse if still pending
      paymentIntent = await stripe.paymentIntents.retrieve(payment.paymentId);
    } else {
      // Create a new payment intent (even if user already has one)
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: "inr",
        description: "Payment for Resume Builder Service",
        metadata: {
          userId,
          planId,
          email: paymentDetails.email || "unknown",
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });
    }

    // ✅ Step 3: Always update the same user document with the new plan/payment details
    payment = await Payment.findOneAndUpdate(
      { userId }, // 👈 only userId (not planId)
      {
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        email: paymentDetails.email,
        planId, // update planId in same document
        clientSecret: paymentIntent.client_secret,
        status: "pending",
        metadata: {
          userId,
          planId,
          email: paymentDetails.email || "unknown",
        },
      },
      { new: true, upsert: true } // 👈 updates or creates only one record per user
    );

    return res.status(200).json({
      message: "Payment intent created or updated successfully",
      paymentId: payment._id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({ error: "Unable to initiate payment" });
  }
};




// ===================== UPDATE PAYMENT STATUS =====================
 const paymentUpdate = async (req: Request, res: Response) => {
  try {
    const { paymentIntent, planId } = req.body;

    if (!paymentIntent?.id || !paymentIntent?.status) {
      return res.status(400).json({ error: "Invalid paymentIntent data" });
    }

    const secretKey = process.env.Secret_key;
    if (!secretKey) {
      return res.status(500).json({ error: "Stripe secret key not configured" });
    }

    const stripe = new Stripe(secretKey);

    // ✅ Step 1: Only update when payment succeeded
    if (paymentIntent.status === "succeeded") {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentIntent.payment_method
      );

      let paymentDetails: Record<string, any> = {};

      if (paymentMethod.type === "card" && paymentMethod.card) {
        paymentDetails = {
          type: "card",
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expiryMonth: paymentMethod.card.exp_month,
          expiryYear: paymentMethod.card.exp_year,
          fingerprint: paymentMethod.card.fingerprint,
        };
      } else if (paymentMethod.type === "link" && paymentMethod.link) {
        paymentDetails = {
          type: "link",
          email: paymentMethod.link.email,
        };
      } else if (paymentMethod.type === "paynow") {
        paymentDetails = { type: "paynow" };
      }

      // ✅ Step 2: Update existing payment record
      const updatedPayment = await Payment.findOneAndUpdate(
        { paymentId: paymentIntent.id },
        {
          status: paymentIntent.status,
          planId: planId,
          paymentDetails,
        },
        { new: true }
      );

      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment record not found" });
      }

      return res.status(200).json({
        message: "Payment updated successfully",
        payment: updatedPayment,
      });
    }

    return res.status(400).json({
      message: "Payment not completed or invalid status",
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return res.status(500).json({
      error: "Unable to update payment. Please try again.",
    });
  }
};

const getPaymentRecord = async (req: Request, res: Response) => {
  try{
    const paymentRecord = await Payment.find();
    res.status(200).json(paymentRecord);
  }
  catch(error){
    res.status(500).json({ message: "Error fetching payment records", error });
  }
}

export { fetchPaymentIntent, paymentUpdate, getPaymentRecord };
