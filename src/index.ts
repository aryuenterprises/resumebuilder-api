


// import app its automatically loads .env variables

import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
import morgan from 'morgan';

import connectDB from './config/database.js';

import authRoutes from './routes/auth.js';
// import candidateRouter from './routes/candidates.js';
import contactRouter from './routes/contacts.js';
// import autoEmailSendJob from './cron/email';
import userRoutes from './routes/users.js';
import candidateRoutes from './routes/candidates';
// import templateRoutes from './routes/templates';
// import contactRoutes from './routes/contact.js';
// import candidateRouter from './routes/candidates';
import autoEmailSendJob from './cron/email.js';
import templateRoutes from './routes/templates.js';
import contactResumeRouter from './routes/contactResumeRouter.js';
import experienceRouter  from './routes/experienceRouter.js';
import educationRouter from './routes/educationRouter.js';
import skillResumeRouter from './routes/skillResumeRouter.js';
import desiredJobTitleRouter from './routes/desiredJobTitleRouter.js'
import planSubscriptionRouter from './routes/planSubscriptionRouter.js'
import summaryRouter from './routes/summaryRouter.js'
import finalizeResumeRouter from './routes/finalizeResumeRouter.js'
// Resolve __dirname in ES Module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(
  cors({
    origin: true, // allow all origins
    credentials: true, // allow cookies/auth headers
  })
);


app.use(express.json());
app.use(morgan('dev'));
async function start(){

await connectDB()
 autoEmailSendJob()
// Routes
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/candidates', candidateRouter);
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
}
start();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});