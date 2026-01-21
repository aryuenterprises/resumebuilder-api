// import cron from "node-cron";
// import ejs from "ejs";
// import path from "path";
// import { fileURLToPath } from "url";
// import { sendEmail } from "../services/emailService";
// import Notification, { INotification } from "../models/notification.js";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const autoEmailSendJob = () => {
//   cron.schedule("* * * * *", async () => {
//     try {
//       const pendingNotifications: INotification[] = await Notification.find({
//         status: "pending",
//       });
//       console.log(` Found ${pendingNotifications.length} pending notifications.`);
//       for (const notif of pendingNotifications) {
//         try {
//           const templatePath = path.join(__dirname, "../views/taskTemplate.ejs");
//           const html = await ejs.renderFile(templatePath, {
//             subject: notif.subject,
//             message: notif.message,
//             name: notif.name || "User",
//           });
//           await sendEmail({
//             to: notif.to,
//             subject: notif.subject || "No Subject",
//             html,
//           });
//           notif.status = "sent";
//           notif.sentAt = new Date();
//           await notif.save();
//           console.log(` Email sent to ${notif.to}`);
//         } catch (err: any) {
//           notif.status = "failed";
//           await notif.save();
//           console.error(` Failed to send email to ${notif.to}: ${err.message}`);
//         }
//       }
//     } catch (err: any) {
//       console.error(" Cron job failed:", err.message);
//     }
//   });
// };
// export default autoEmailSendJob;
