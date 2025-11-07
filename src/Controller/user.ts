import { User } from "@models/User";
import { Request, Response } from "express";
import mongoose, { trusted } from "mongoose";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/emailService";
import { Payment } from "../models/paymentModel";
import crypto from "crypto";
import { ContactResume } from "@models/ContactResume";
import { PaymentLog } from "@models/paymentLogModel";

const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find();

    const planSubscriptions = await Promise.all(
      users.map(async (user) => {
        const planSubscription = await Payment.findOne({
          userId: user._id,
        }).populate("planId");
        return planSubscription;
      })
    );

    const usersWithPlanSubscriptions = users.map((user, index) => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      state: user.state,
      country: user.country,
      status: user.status,
      isVerified: user.isVerified,
      planId: planSubscriptions[index]?.planId?.name || null,
      planStatus: planSubscriptions[index]?.status || "none",
      amount: planSubscriptions[index]?.amount || 0,
      paymentDetails: planSubscriptions[index]?.paymentDetails || null,
    }));

    return res.json({ users: usersWithPlanSubscriptions });
  } catch (error) {
    console.error("Error in dashboard:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
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

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must be 8+ chars and include Aa1@" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      city,
      state,
      country,
      password,
      verifyToken,
      isVerified: false,
    });
    // await sendEmail(email, "Welcome to Aryu Academy", "addUser.html", {
    //   firstName,
    //   email,
    // });
    const API_URL = process.env.API_URL;
    const verificationLink = `${API_URL}/api/users/verify/${verifyToken}`;

    await sendEmail(email, "Verify your Aryu Academy account", "addUser.html", {
      firstName,
      verificationLink,
    });
    res.status(201).json({
      success: true,
      message: "Verification email sent to user",
      user,
    });
  } catch (error: unknown) {
    console.error("Error creating user:", error);

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

    if (error instanceof mongoose.Error.ValidationError) {
      const errors: Record<string, string> = {};
      for (const field in error.errors) {
        if (Object.prototype.hasOwnProperty.call(error.errors, field)) {
          errors[field] = error.errors[field].message;
        }
      }
      return res.status(400).json({ success: false, errors });
    }

    res.status(500).json({
      message: "Internal server error",
      error:
        error instanceof Error ? error.message : "Unexpected error occurred",
    });
  }
};

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verifyToken: token });
    if (!user) {
      res.status(400).send("<h3>Invalid or expired verification link.</h3>");
      return;
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.redirect(
      "https://resumebuilder.aryuacademy.com/loginig?verified=success"
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    res
      .status(500)
      .send("<h3>Internal server error. Please try again later.</h3>");
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
      status: payment.status,
    }));

    return res.json({ payments: formattedPayments });
  } catch (error) {
    console.error("Error in dashboard:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// const downloadResume = async (req: Request, res: Response) => {
//   try {
//     const { userId, resume, contactId } = req.query;

//     if (!userId) {
//       return res.status(400).json({ message: "userId is required" });
//     }

//     const payments = await Payment.find({ userId: userId })
//       .populate("planId", "name")
//       .lean();

//     const paymentsToUpdate = payments.filter(
//       (payment) => payment.planId?.name !== "Lifetime Full Access Option"
//     );

//     const paymentIds = paymentsToUpdate.map((p) => p._id);
//     if (paymentIds.length > 0) {
//       await Payment.updateMany(
//         { _id: { $in: paymentIds } },
//         { $unset: { planId: "" } }
//       );
//     }

//     const contactResumeDetails = await ContactResume.find({ _id: contactId });
//     const photoFile = req.files?.find((file) => file.fieldname === "photo");
//     if (photoFile) {
//       const photo = photoFile.filename;
//     }
//     //get the resume file in ContactResume model
//     const resumes = await ContactResume.findByIdAndUpdate(contactId, {
//       resume: photo,
//     });

//     return res.json({ success: true, message: "Plan Removed Successfully" });
//   } catch (error) {
//     console.error("Error in dashboard:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

//  const downloadResume = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { userId, contactId } = req.body;
//     const resumeFile = req.file;

//     if (!userId) {
//       res.status(400).json({ message: "userId is required" });
//       return;
//     }

//     if (!contactId) {
//       res.status(400).json({ message: "contactId is required" });
//       return;
//     }

  
//     const contact = await ContactResume.findById(contactId);
//     if (!contact) {
//       res.status(404).json({ message: "Contact not found", success: false });
//       return;
//     }

//     const hasResume: boolean = !!(contact.resume && contact.resume.trim() !== "");

//     if (hasResume) {
//       res.status(404).json({
//         success: false,
//         message: "Resume already downloaded",
//         hasResume: true,
//       });
//       return;
//     }

//     if (!resumeFile) {
//       res.status(400).json({ message: "Resume file is required" });
//       return;
//     }

//     const payments = await Payment.find({ userId })
//       .populate("planId", "name price")
//       .lean();

//     const paymentLogs = await PaymentLog.find({ userId })
//       .populate("planId", "name price")
//       .lean();

//     const paymentsToUpdate = payments.filter(
//       (payment: any) => payment.planId?.name !== "Lifetime Full Access Option"
//     );

//     const paymentIds = paymentsToUpdate.map((p: any) => p._id);

//     if (paymentIds.length > 0) {
//       await Payment.updateMany({ _id: { $in: paymentIds } }, { $unset: { planId: "" } });
//     }

//     const formattedPayments = payments.map((payment) => ({
//       plan: payment.planId?.name || null,
//       amount: payment.planId?.price || null,
//       status: payment.status,
//     }));

//     const updatedResume = await ContactResume.findByIdAndUpdate(
//       contactId,
//       { resume: resumeFile.filename },
//       { new: true }
//     );

//     console.log("Updated Resume:", updatedResume);

//     res.json({
//       success: true,
//       message: "Resume uploaded successfully",
//       // payments: formattedPayments,
//       hasResume: true,
//       // data: updatedResume,
//     });
//   } catch (error) {
//     console.error("Error in downloadResume:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const downloadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, contactId } = req.body;
    const resumeFile = req.file;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    if (!contactId) {
      res.status(400).json({ message: "contactId is required" });
      return;
    }

    const contact = await ContactResume.findById(contactId);
    if (!contact) {
      res.status(404).json({ message: "Contact not found", success: false });
      return;
    }

    const payments = await Payment.find({ userId })
      .populate("planId", "name price")
      .lean();

    const paymentLogs = await PaymentLog.find({ userId })
      .populate("planId", "name price")
      .lean();

    const hasLifetimeAccess = payments.some(
      (payment: any) => payment.planId?.name === "Lifetime Full Access"
    );

    if (!hasLifetimeAccess) {
      const hasResume: boolean = !!(contact.resume && contact.resume.trim() !== "");
      if (hasResume) {
        res.status(404).json({
          success: false,
          message: "Resume already downloaded",
          hasResume: true,
        });
        return;
      }
    }

    if (!resumeFile) {
      res.status(400).json({ message: "Resume file is required" });
      return;
    }

    // Filter only non-lifetime plans
    const paymentsToUpdate = payments.filter(
      (payment: any) => payment.planId?.name !== "Lifetime Full Access Option"
    );

    const paymentIds = paymentsToUpdate.map((p: any) => p._id);

    if (paymentIds.length > 0) {
      await Payment.updateMany(
        { _id: { $in: paymentIds } },
        { $unset: { planId: "" } }
      );
    }

    const formattedPayments = payments.map((payment) => ({
      plan: payment.planId?.name || null,
      amount: payment.planId?.price || null,
      status: payment.status,
    }));

    const updatedResume = await ContactResume.findByIdAndUpdate(
      contactId,
      { resume: resumeFile.filename },
      { new: true }
    );

    console.log("Updated Resume:", updatedResume);

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      hasResume: true,
      formattedPayments: formattedPayments
    });
  } catch (error) {
    console.error("Error in downloadResume:", error);
    res.status(500).json({ message: "Internal server error" });
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

    if (user.isVerified === false) {
      return res.status(401).json({ message: "User is not verified" });
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
  downloadResume,
  dashboard,
  getAllUsers,
  getUserById,
  addUser,
  editUser,
  deleteUser,
  loginUser,
  forgotPassword,
  verifyEmail,
};
