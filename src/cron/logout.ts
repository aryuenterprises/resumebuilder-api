// cron/job.ts
import cron from "node-cron";
import { User } from "../models/User";

cron.schedule("* * * * *", async () => {
    console.log("Cron running every 10 seconds");
  try {
    // Group 1: Should redirect
    await User.updateMany(
      {
        $or: [
          { isDeleted: "1" },
          { status: "0" },
          { isVerified: false }
        ]
      },
      { $set: { shouldRedirect: true } }
    );

    // Group 2: Should NOT redirect  
    await User.updateMany(
      {
        isDeleted: "0",
        status: "1",      // *** FIX: only users with status "1" are allowed ***
        isVerified: true
      },
      { $set: { shouldRedirect: false } }
    );

    console.log("Cron ran successfully");
  } catch (err) {
    console.error("Cron error:", err);
  }
});

