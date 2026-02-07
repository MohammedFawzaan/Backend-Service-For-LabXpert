import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to verify JWT token
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token saved in cookie" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authMiddleware = protect;