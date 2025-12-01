import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authMiddleware } from '../middlewares/authMiddleware.js'
import userModel from "../models/user.model.js";

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {

    const isFirstTime = !req.user.role;

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    if (isFirstTime) {
      return res.redirect(`${process.env.FRONTEND_URL}/select-role`);
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}/home`);
    }
  }
);

router.get(
  '/auth/check',
  authMiddleware,
  async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ authenticated: false });
    }
    res.json({ user: req.user, authenticated: true });
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: '/'
  });

  res.clearCookie("role", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: '/'
  });

  return res.json({ message: "Logged out" });
});

router.post("/set-role", authMiddleware, async (req, res) => {
  const { role } = req.body;
  const userId = req.user._id;
  if (!["student", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role) {
      return res.status(400).json({
        message: "Role already set. Cannot change again.",
      });
    }
    user.role = role;
    await user.save();
    res.cookie("role", role, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.json({ message: "Role set successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;