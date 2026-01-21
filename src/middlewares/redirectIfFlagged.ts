// middleware/redirectIfFlagged.ts
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

export const redirectIfFlagged = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.session?.userId || req.user?._id;

    if (!userId) {
      return res.redirect("https://resumebuilder.aryuacademy.com/loging");
    }

    const user = await User.findById(userId);

    if (!user || user.shouldRedirect) {
      if (req.session) req.session.destroy(() => {});
      return res.redirect("https://resumebuilder.aryuacademy.com/loging");
    }

    next();
  } catch (err) {
    console.error("Middleware error:", err);
    next(err);
  }
};
