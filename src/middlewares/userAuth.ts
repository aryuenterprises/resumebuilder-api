import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: string | any; // adjust type according to your decoded JWT payload
    }
  }
}

const useAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log("Cookies:", req.cookies);
  const token = req.cookies?.token;
  console.log("Token from cookies:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as string | jwt.JwtPayload;

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = decoded ;

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default useAuth;
