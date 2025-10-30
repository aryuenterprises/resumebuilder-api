import { Schema, model } from 'mongoose';
const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email'],
    },
    password: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    verifyOtp: {
        type: Number,
    },
    verifyOtpExpireAt: {
        type: Date,
    },
    googleId: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });
export const Admin = model('Admin', adminSchema);
