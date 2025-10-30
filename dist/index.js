// import app its automatically loads .env variables
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
// import connectDB from './config/database.js';
// import authRoutes from './routes/auth.js';
// import candidateRouter from './routes/candidates.js';
// import contactRouter from './routes/contacts.js';
// import autoEmailSendJob from './cron/email';
// import userRoutes from './routes/users';
// import candidateRoutes from './routes/candidates';
// import templateRoutes from './routes/templates';
// import contactRoutes from './routes/contacts';
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
async function start() {
    app.use(cors());
    app.use(express.json());
    // await connectDB()
    //  autoEmailSendJob()
    // Routes
    // app.use('/api/auth', authRoutes);
    // // app.use('/api/users', userRoutes);
    // app.use('/api/candidates', candidateRouter);
    // // app.use('/api/templates', templateRoutes);
    // app.use('/api/contacts', contactRouter);
}
start();
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
