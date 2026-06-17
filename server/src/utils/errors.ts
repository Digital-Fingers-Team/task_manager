export interface ApiFieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly errors?: ApiFieldError[];

  constructor(message: string, statusCode = 500, errors?: ApiFieldError[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
