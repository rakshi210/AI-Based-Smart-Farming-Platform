import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Avoid leaking sensitive database traces or passwords
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected server error occurred.';

  // If MongoDB validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
    return;
  }

  // If MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    res.status(400).json({
      success: false,
      message: 'An account with this email address already exists.',
    });
    return;
  }

  res.status(status).json({
    success: false,
    message,
  });
};

