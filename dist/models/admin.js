import { Schema, model } from "mongoose";
const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Invalid email"],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (value) {
                // At least one uppercase, one lowercase, one number, one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
            },
            message: "Password must be 8+  chars: Aa1@",
        },
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
export const Admin = model("Admin", adminSchema);
