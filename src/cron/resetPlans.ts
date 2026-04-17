// import cron from "node-cron";
// import { Payment } from "../models/paymentModel";

// cron.schedule("0 0 * * *", async () => {
//   console.log("Cron triggered");

//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//   try {
//     const payments = await Payment.find({
//       updatedAt: { $lt: sevenDaysAgo }
//     }).populate("planId");

//     const expiredPayments = payments.filter(
//       (p) => p.planId?.plan === "one month"
//     );

//     if (expiredPayments.length > 0) {
//       const ids = expiredPayments.map((p) => p._id);

//       await Payment.updateMany(
//         { _id: { $in: ids } },
//         { $unset: { planId: "" } }
//       );

//       console.log("Expired plans reset:", ids.length);
//     } else {
//       console.log("No expired plans found");
//     }

//   } catch (err) {
//     console.error("Cron error:", err);
//   }
// });
// cron.schedule("0 0 * * *", async () => {
//   console.log("Cron triggered");

//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//   try {
//     const payments = await Payment.find({
//       updatedAt: { $lt: sevenDaysAgo }
//     }).populate("planId");

//     const expiredPayments = payments.filter(
//       (p) => p.planId?.plan === "three month"
//     );

//     if (expiredPayments.length > 0) {
//       const ids = expiredPayments.map((p) => p._id);

//       await Payment.updateMany(
//         { _id: { $in: ids } },
//         { $unset: { planId: "" } }
//       );

//       console.log("Expired plans reset:", ids.length);
//     } else {
//       console.log("No expired plans found");
//     }

//   } catch (err) {
//     console.error("Cron error:", err);
//   }
// });


import cron from "node-cron";
// import { Payment } from "../models/paymentModel";
import {PaymentRazor} from "../models/paymentRazorModel";

// Cron job for "one month" plans - runs daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Checking for expired 'one month' plans...");

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    const payments = await PaymentRazor.find({
      updatedAt: { $lt: oneMonthAgo }
    }).populate("planId");

    const expiredPayments = payments.filter(
      (p) => p.planId?.plan === "one month"
    );

    if (expiredPayments.length > 0) {
      const ids = expiredPayments.map((p) => p._id);

      await PaymentRazor.updateMany(
        { _id: { $in: ids } },
        { $unset: { planId: "" } }
      );

      console.log(`Expired 'one month' plans reset: ${ids.length}`);
    } else {
      console.log("No expired 'one month' plans found");
    }

  } catch (err) {
    console.error("Cron error (one month):", err);
  }
});

// Cron job for "three month" plans - runs daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Checking for expired 'three month' plans...");

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    const payments = await PaymentRazor.find({
      updatedAt: { $lt: threeMonthsAgo }
    }).populate("planId");

    const expiredPayments = payments.filter(
      (p) => p.planId?.plan === "three month"
    );

    if (expiredPayments.length > 0) {
      const ids = expiredPayments.map((p) => p._id);

      await PaymentRazor.updateMany(
        { _id: { $in: ids } },
        { $unset: { planId: "" } }
      );

      console.log(`Expired 'three month' plans reset: ${ids.length}`);
    } else {
      console.log("No expired 'three month' plans found");
    }

  } catch (err) {
    console.error("Cron error (three month):", err);
  }
});
