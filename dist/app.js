import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import candidateRouter from './routes/candidates';
import contactRouter from './routes/contacts';
// import userRoutes from './routes/users';
// import candidateRoutes from './routes/candidates';
// import templateRoutes from './routes/templates';
// import contactRoutes from './routes/contacts';
dotenv.config();
const app = express();
async function start() {
    app.use(cors());
    app.use(express.json());
    await connectDB();
    // Routes
    app.use('/api/auth', authRoutes);
    // app.use('/api/users', userRoutes);
    app.use('/api/candidates', candidateRouter);
    // app.use('/api/templates', templateRoutes);
    app.use('/api/contacts', contactRouter);
}
start();
export default app;
