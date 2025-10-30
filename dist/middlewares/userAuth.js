import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const useAuth = (req, res, next) => {
    console.log("Cookies:", req.cookies);
    const token = req.cookies?.token;
    console.log("Token from cookies:", token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};
export default useAuth;
