// cron/job.ts
import cron from "node-cron";
import { User } from "../models/User";

cron.schedule("*/10 * * * *", async () => {
  try {
    // Flag users
    await User.updateMany(
      { $or: [{ isDeleted: "1" }, { status: "0" }, { isVerified: false }] },
      { $set: { shouldRedirect: true } }
    );

    // Clear flag for eligible users
    await User.updateMany(
      { $and: [{ isDeleted: { $ne: "1" } }, { status: { $ne: "0" } }, { isVerified: true }] },
      { $set: { shouldRedirect: false } }
    );

    console.log("Cron job executed successfully");
  } catch (err) {
    console.error("Cron error:", err);
  }
});
