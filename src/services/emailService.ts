import { transporter } from "../config/nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { setting } from "../models/setting";
// /**
//  * Send email using an HTML template
//  * @param {string} to - Recipient email
//  * @param {string} subject - Email subject
//  * @param {string} templateName - Template filename (e.g. "addUser.html")
//  * @param {object} replacements - Key/value pairs to replace placeholders in template
//  */
export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  replacements: Record<string, string>
) => {
  try {
   const smtp = await setting.findOne();
    if (!smtp) throw new Error("SMTP settings not found");
    // ✅ This ensures the path is relative to this file’s actual location
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // ✅ Build path to template safely
    const templatePath = path.join(__dirname, "templates", templateName);
    console.log("📂 Email template path:", templatePath);

    // ✅ Read HTML file
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    let html = fs.readFileSync(templatePath, "utf8");

    // ✅ Replace {{placeholders}} with actual values
    for (const key in replacements) {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, replacements[key]);
    }

    // ✅ Mail configuration
    const mailOptions = {
      from: `"${smtp.fromName}" <${smtp.username}>`,
      to,
      subject,
      html,
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} using ${templateName}`);
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message);
  }
};

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   templateName: string,
//   replacements: Record<string, string>
// ) => {
//   try {
//     const smtp = await setting.findOne();

//     if (!smtp) {
//       throw new Error("SMTP settings not found in database");
//     }

//     const transporter = nodemailer.createTransport({
//       host: smtp.host,
//       port: Number(smtp.port),
//       secure: false,
//       auth: {
//         user: smtp.username,
//         pass: smtp.password,
//       },
//     });

//     console.log("transporter", transporter);

//     // Load template
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     const templatePath = path.join(__dirname, "templates", templateName);

//     if (!fs.existsSync(templatePath)) {
//       throw new Error(`Template not found: ${templatePath}`);
//     }

//     let html = fs.readFileSync(templatePath, "utf8");

//     // replace {{key}}
//     for (const key in replacements) {
//       html = html.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
//     }

//     // Send email
//     await transporter.sendMail({
//       from: `"${smtp.fromName}" <${smtp.username}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log(`Email sent to ${to}`);
//   } catch (error: any) {
//     console.error("Email sending error:", error.message);
//   }
// };
