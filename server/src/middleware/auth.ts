import type { RequestHandler } from "express";

import { UserModel } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/errors";
import { verifyAccessToken } from "../utils/jwt";

export const protect: RequestHandler = asyncHandler(async (req, _res, next) => {
  const authorization = req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError("Authentication token is required.", 401);
  }

  const token = authorization.slice("Bearer ".length).trim();
  const payload = verifyAccessToken(token);
  const user = await UserModel.findById(payload.userId).select("_id name email");

  if (!user) {
    throw new AppError("Authenticated user no longer exists.", 401);
  }

  req.user = {
    id: user._id.toString(),
    name: user.name,
    email: user.email
  };

  next();
});
