import type { ErrorRequestHandler, RequestHandler } from "express";

import { env } from "../config/env";
import { AppError } from "../utils/errors";

interface MongoLikeError {
  code?: number;
  keyValue?: Record<string, unknown>;
  name?: string;
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors
    });
    return;
  }

  const maybeMongoError = error as MongoLikeError;

  if (maybeMongoError.code === 11000) {
    res.status(409).json({
      message: "A record with this value already exists."
    });
    return;
  }

  if (maybeMongoError.name === "CastError") {
    res.status(400).json({
      message: "Invalid resource identifier."
    });
    return;
  }

  const message =
    env.nodeEnv === "production" ? "Internal server error." : String(error);

  res.status(500).json({
    message
  });
};
