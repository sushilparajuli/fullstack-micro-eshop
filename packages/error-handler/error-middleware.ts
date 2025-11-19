import { AppError } from '.';
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    console.error(`Error ${req.method} ${req.url} = ${err.message}`);

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.details && { details: err.details }),
    });
    next();
  }
  res.status(500).json({
    error: 'Something went wrong, please try again later!',
  });
  next();
};
