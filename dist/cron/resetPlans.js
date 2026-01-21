import cron from "node-cron";
import { Payment } from "../models/paymentModel";
cron.schedule("0 0 * * *", async () => {
    console.log("Cron triggered");
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    try {
        const payments = await Payment.find({
            updatedAt: { $lt: sevenDaysAgo }
        }).populate("planId");
        const expiredPayments = payments.filter((p) => p.planId?.plan === "7-days access");
        if (expiredPayments.length > 0) {
            const ids = expiredPayments.map((p) => p._id);
            await Payment.updateMany({ _id: { $in: ids } }, { $unset: { planId: "" } });
            console.log("Expired plans reset:", ids.length);
        }
        else {
            console.log("No expired plans found");
        }
    }
    catch (err) {
        console.error("Cron error:", err);
    }
});
