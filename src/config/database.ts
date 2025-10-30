import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(" MONGO_URI is not defined in your .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any); // optional: mongoose typings may not require these in v6+
    
    console.log(" MongoDB connected successfully");
  } catch (error) {
    // Fix: explicitly cast error type
    const err = error as Error;
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
