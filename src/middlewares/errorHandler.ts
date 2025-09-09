import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';
import { ValidationError } from '../utils/validationError.js';

// Custom error class for unauthorized access
export class UnauthorizedError extends Error {
  statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    Error.captureStackTrace(this, this.constructor);
  }
}

interface CustomError extends Error {
  statusCode?: number;
  errors?: ValidationError[];
  code?: number;
  keyValue?: Record<string, any>;
  value?: any;
  type?: string;
}

/**
 * Middleware para manejo de errores
 */
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Establecer valores por defecto
  err.statusCode = err.statusCode || 500;
  
  let error = { ...err };
  error.message = err.message;

  // Handle custom validation errors
  if (err.type === 'ValidationError' && err.errors) {
    return res.status(400).json({
      success: false,
      errors: err.errors,
      message: 'Validation error',
    });
  }

  // Log del error para desarrollo
  logger.error({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });

  // Manejar errores específicos de Mongoose
  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message);
    error = new Error(message[0]);
    error.statusCode = 400;
  }

  // Error de duplicados (código 11000)
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    const message = `El campo ${field} ya existe. Por favor, utiliza un valor diferente.`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // Error de casteo (CastError)
  if (err.name === 'CastError') {
    const message = `Recurso no encontrado`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token de autenticación inválido';
    error = new Error(message);
    error.statusCode = 401;
  }

  // Error de expiración de JWT
  if (err.name === 'TokenExpiredError') {
    const message = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
    error = new Error(message);
    error.statusCode = 401;
  }

  // Enviar respuesta de error al cliente
  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? error.stack : {},
  });
};

/**
 * Middleware para manejar rutas no encontradas (404)
 */
export const notFound = (message: string, req?: Request, res?: Response, next?: NextFunction) => {
  const error = new Error(message || `Ruta no encontrada - ${req?.originalUrl}`);
  (error as any).statusCode = 404;
  
  if (next) {
    return next(error);
  }
  
  return error;
};
