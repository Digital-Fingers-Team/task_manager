import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AppError } from "./errors";

interface AccessTokenPayload {
  userId: string;
}

export const signAccessToken = (userId: string): string =>
  jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: "7d"
  });

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string" ||
      decoded.userId.length === 0
    ) {
      throw new AppError("Invalid access token.", 401);
    }

    return {
      userId: decoded.userId
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired access token.", 401);
  }
};
