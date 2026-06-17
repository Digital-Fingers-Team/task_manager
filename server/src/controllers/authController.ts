import bcrypt from "bcrypt";

import { UserModel } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/errors";
import { signAccessToken } from "../utils/jwt";
import { serializeUser } from "../utils/serializers";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const register = asyncHandler(async (req, res) => {
  const body = req.body as RegisterBody;
  const email = body.email.trim().toLowerCase();
  const existingUser = await UserModel.exists({ email });

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const password = await bcrypt.hash(body.password, 12);
  const user = await UserModel.create({
    name: body.name.trim(),
    email,
    password
  });
  const token = signAccessToken(user._id.toString());

  res.status(201).json({
    token,
    user: serializeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const body = req.body as LoginBody;
  const email = body.email.trim().toLowerCase();
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isValidPassword = await bcrypt.compare(body.password, user.password);

  if (!isValidPassword) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = signAccessToken(user._id.toString());

  res.status(200).json({
    token,
    user: serializeUser(user)
  });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Authentication is required.", 401);
  }

  const user = await UserModel.findById(req.user.id).select("_id name email createdAt");

  if (!user) {
    throw new AppError("Authenticated user no longer exists.", 401);
  }

  res.status(200).json({
    user: serializeUser(user)
  });
});
