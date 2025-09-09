import { Response } from 'express';

export class HttpException extends Error {
  statusCode: number;
  errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: any, res: Response) => {
  const { statusCode = 500, message, errors } = err;
  
  // Log the error for debugging
  console.error(err);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: any, res: Response, next: any) => {
  const error = new HttpException(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorConverter = (err: any, req: any, res: Response, next: any) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new HttpException(404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value`;
    error = new HttpException(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new HttpException(400, 'Validation Error', message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new HttpException(401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new HttpException(401, message);
  }

  if (!(error instanceof HttpException)) {
    error = new HttpException(error.statusCode || 500, error.message || 'Server Error');
  }

  next(error);
};
