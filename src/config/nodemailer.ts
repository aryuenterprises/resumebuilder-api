import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Hostinger SMTP host
  port: 465,                  // Port for SSL
  secure: true,               // Use true for port 465
  auth: {
    user: process.env.EMAIL_USER, // your full email address
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
  tls: {
    rejectUnauthorized: false, // helps avoid SSL handshake errors
  },
});

// ✅ Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error with mail transporter:", error);
  } else {
    console.log("✅ Mail transporter is ready to send emails");
  }
});
