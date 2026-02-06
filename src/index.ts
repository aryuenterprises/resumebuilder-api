


// import app its automatically loads .env variables

import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import morgan from 'morgan';
import "./cron/resetPlans";
import "./cron/logout";
import connectDB from './config/database';
import bodyParser from "body-parser";
import authRoutes from './routes/auth';
// import candidateRouter from './routes/candidates.js';
import contactRouter from './routes/contacts';
// import autoEmailSendJob from './cron/email';
import userRoutes from './routes/users';
import candidateRoutes from './routes/candidates';
// import templateRoutes from './routes/templates';
// import contactRoutes from './routes/contact';
import candidateRouter from './routes/candidates';
// import autoEmailSendJob from './cron/email';
import templateRoutes from './routes/templates';
import contactResumeRouter from './routes/contactResumeRouter';
import experienceRouter  from './routes/experienceRouter';
import educationRouter from './routes/educationRouter';
import skillResumeRouter from './routes/skillResumeRouter';
import desiredJobTitleRouter from './routes/desiredJobTitleRouter'
import planSubscriptionRouter from './routes/planSubscriptionRouter'
import summaryRouter from './routes/summaryRouter'
import finalizeResumeRouter from './routes/finalizeResumeRouter'
import keyboardRouter from './routes/keyboardRouter';
import toneRouter from './routes/toneRouter';
import resumeTemplateRouter from './routes/resumeTemplateRouter';
import paymentRouter from './routes/paymentRouter';
import settingRouter from '@routes/settingRouter';


// Resolve __dirname in ES Module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT = process.env.PORT || 3003;
const app = express();
app.use(
  cors({
    origin: true, // allow all origins
    credentials: true, // allow cookies/auth headers
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(morgan('dev'));
async function start(){

await connectDB()
//  autoEmailSendJob()
// Routes
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRouter);
app.use('/api/templates', templateRoutes);
app.use('/api/contacts', contactRouter);
app.use('/api/contact-resume', contactResumeRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/education', educationRouter);
app.use('/api/skill', skillResumeRouter);
app.use('/api/desired-job-title', desiredJobTitleRouter);
app.use('/api/plan-subscription', planSubscriptionRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/finalize-resume', finalizeResumeRouter);
app.use('/api/keyboard-resume', keyboardRouter);
app.use('/api/tone-resume', toneRouter);
app.use('/api/resume-template', resumeTemplateRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/setting', settingRouter);

}
start();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});