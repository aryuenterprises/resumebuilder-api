import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { setting } from "../models/setting";

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  replacements: Record<string, string>
) => {
  try {
    const smtp = await setting.findOne();
    if (!smtp) throw new Error("SMTP settings not found");

    // ✅ Create transporter dynamically
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: Number(smtp.port),
      secure: Number(smtp.port) === 465, // true for 465, false for 587
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
    });

    // ✅ Verify SMTP connection (VERY IMPORTANT)
    await transporter.verify();
    console.log("✅ SMTP verified successfully");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const templatePath = path.join(__dirname, "templates", templateName);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    let html = fs.readFileSync(templatePath, "utf8");

    for (const key in replacements) {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
    }

    await transporter.sendMail({
      from: `"${smtp.fromName}" <${smtp.username}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error: any) {
    console.error("❌ Email sending failed:", error.message);
  }
};
