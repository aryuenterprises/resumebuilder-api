import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();
// Setup transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Email sending function
const sendEmail = async ({ to, subject, html, from }) => {
    console.log(' Preparing to send email to:', to);
    try {
        const mailOptions = {
            from: from || `"Your Company" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(' Email sent:', info.response);
        return info;
    }
    catch (error) {
        console.error(' Email error:', error.message);
        throw error;
    }
};
export default sendEmail;
