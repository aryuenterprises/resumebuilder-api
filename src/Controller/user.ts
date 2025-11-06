import { User } from "@models/User";
import { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/emailService";
import { Payment } from "../models/paymentModel";
// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

// Get user by ID
const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

const addUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      state,
      country,
      password,
    } = req.body;

    // // 🔹 Validate required fields
    // if (!firstName || !lastName || !email || !phone || !city || !state || !country || !password) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }

    // 🔹 Validate password strength
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must be 8+ chars and include Aa1@" });
    }

    // 🔹 Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔹 Create new user (password gets hashed automatically in model)
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      city,
      state,
      country,
      password,
    });
    await sendEmail(email, "Welcome to Aryu Academy", "addUser.html", {
      firstName,
      email,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error: unknown) {
    console.error("Error creating user:", error);

    // 🔹 Handle duplicate key error
    if (
      error instanceof mongoose.Error &&
      (error as any).code === 11000 &&
      (error as any).keyPattern
    ) {
      const duplicateField = Object.keys((error as any).keyPattern)[0];
      return res.status(400).json({
        message: `${duplicateField} already exists`,
        field: duplicateField,
      });
    }

    // 🔹 Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors: Record<string, string> = {};
      for (const field in error.errors) {
        if (Object.prototype.hasOwnProperty.call(error.errors, field)) {
          errors[field] = error.errors[field].message;
        }
      }
      return res.status(400).json({ success: false, errors });
    }

    // 🔹 Default internal error
    res.status(500).json({
      message: "Internal server error",
      error:
        error instanceof Error ? error.message : "Unexpected error occurred",
    });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
};

const dashboard = async (req: Request, res: Response) => {
  try {
    const { userId, type, planId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (type === "download") {
      const payments = await Payment.find({ userId: userId })
        .populate("planId", "name")
        .lean();

      const paymentsToUpdate = payments.filter(
        (payment) => payment.planId?.name !== "Lifetime Full Access Option"
      );

      const paymentIds = paymentsToUpdate.map((p) => p._id);
      if (paymentIds.length > 0) {
        await Payment.updateMany(
          { _id: { $in: paymentIds } },
          { $unset: { planId: "" } }
        );
      }
    }
    const updatedPayments = await Payment.find({ userId: userId })
      .populate("planId", "name price")
      .lean();

    const formattedPayments = updatedPayments.map((payment) => ({
      plan: payment.planId?.name || null,
      amount: payment.planId?.price || null,
    }));

    return res.json({ payments: formattedPayments });
  } catch (error) {
    console.error("Error in dashboard:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 🔹 Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 🔹 Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status === "0") {
      return res.status(401).json({ message: "User is inactive" });
    }

    // 🔹 Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1h" }
    );
    const payments = await Payment.findOne({ userId: user._id }).populate(
      "planId"
    );

    // 🔹 Respond with token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        country: user.country,
        planId: payments?.planId || null,
        planName: (payments?.planId as any)?.name || "",
        planPrice: (payments?.planId as any)?.price || "",
        amount: payments?.amount || 0,
        status: payments?.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
      error:
        error instanceof Error ? error.message : "Unexpected error occurred",
    });
  }
};

// Update user
const editUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, city, state, country, status } =
    req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { firstName, lastName, email, phone, city, state, country, status },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Delete user
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const desiredJobTitle = await User.findByIdAndDelete(id);
    if (!desiredJobTitle) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "user deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export {
  dashboard,
  getAllUsers,
  getUserById,
  addUser,
  editUser,
  deleteUser,
  loginUser,
  forgotPassword,
};
