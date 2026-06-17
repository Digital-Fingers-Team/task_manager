import type { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { AppError } from "../utils/errors";

export const validateRequest: RequestHandler = (req, _res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    next();
    return;
  }

  const errors = result.array().map((error) => ({
    field: "path" in error ? error.path : "request",
    message: String(error.msg)
  }));

  next(new AppError("Validation failed.", 422, errors));
};
