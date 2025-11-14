import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.redirect(`${process.env.FRONTEND_URL}/home`);
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
    secure: false,
    sameSite: "lax",
    path: '/'
  });

  return res.json({ message: "Logged out" });
});

export default router;