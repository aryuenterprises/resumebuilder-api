import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password?: string;
  isAdmin: boolean;
  isAccountVerified: boolean;
  isDeleted: boolean;
  verifyOtp: number;
  verifyOtpExpireAt: Date;
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
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
        validator: function (value: string) {
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
  },
  { timestamps: true }
);

export const Admin = model<IAdmin>("Admin", adminSchema);
