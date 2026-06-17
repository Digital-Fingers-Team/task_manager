import { Router } from "express";
import { body } from "express-validator";

import { login, me, register } from "../controllers/authController";
import { protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";

export const authRouter = Router();

authRouter.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage("Name must be between 2 and 80 characters."),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address.")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters.")
  ],
  validateRequest,
  register
);

authRouter.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address.")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters.")
  ],
  validateRequest,
  login
);

authRouter.get("/me", protect, me);
