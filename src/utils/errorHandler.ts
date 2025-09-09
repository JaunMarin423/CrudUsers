/**
 * Clase base para errores personalizados
 */
class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
    this.isOperational = true;

    // Capturar el stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error 400 - Bad Request
 */
export class BadRequestError extends AppError {
  constructor(message = 'Solicitud incorrecta') {
    super(message, 400);
  }
}

/**
 * Error 401 - Unauthorized
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

/**
 * Error 403 - Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permiso para realizar esta acción') {
    super(message, 403);
  }
}

/**
 * Error 404 - Not Found
 */
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

/**
 * Error 409 - Conflict
 */
export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el recurso') {
    super(message, 409);
  }
}

/**
 * Error 422 - Unprocessable Entity
 */
export class ValidationError extends AppError {
  errors: any[];

  constructor(errors: any[] = [], message = 'Error de validación') {
    super(message, 422);
    this.errors = errors;
  }
}

/**
 * Error 500 - Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500);
  }
}

/**
 * Manejo global de errores
 */
export const globalErrorHandler = (
  err: any,
  req: any,
  res: any,
  next: any
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle our custom validation errors
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: 'Validation Error',
        errors: err.errors
      });
    }
  }
};

export default {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
  globalErrorHandler,
};
