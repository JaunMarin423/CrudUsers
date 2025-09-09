import { Request, Response, NextFunction } from 'express';
import { verifyToken, getTokenFromHeader } from '../utils/jwt.js';
import User from '../models/user.model.js';
import { UnauthorizedError } from './errorHandler.js';

// Interfaz extendida de Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware para proteger rutas que requieren autenticación
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Obtener el token del encabezado
    const token = getTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      throw new UnauthorizedError('No estás autenticado. Por favor inicia sesión para acceder.');
    }

    // 2) Verificar el token
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new UnauthorizedError('Token inválido o expirado. Por favor inicia sesión de nuevo.');
    }

    // 3) Verificar si el usuario aún existe
    const currentUser = await User.findById(decoded.id).select('+isActive');
    if (!currentUser) {
      throw new UnauthorizedError('El usuario al que pertenece este token ya no existe.');
    }

    // 4) Verificar si el usuario está activo
    if (!currentUser.isActive) {
      throw new UnauthorizedError('Tu cuenta ha sido desactivada.');
    }

    // 5) Añadir el usuario al objeto de solicitud
    req.user = currentUser;
    
    // 6) Continuar con el siguiente middleware
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar roles de usuario
 * @param roles - Array de roles permitidos
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('No estás autenticado.');
      }

      if (!roles.includes(req.user.role)) {
        throw new UnauthorizedError('No tienes permiso para realizar esta acción.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware para verificar si el usuario es el propietario del recurso o es administrador
 */
export const isOwnerOrAdmin = (model: any, paramName = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('No estás autenticado.');
      }

      // Permitir a los administradores
      if (req.user.role === 'admin') {
        return next();
      }

      // Obtener el recurso
      const resource = await model.findById(req.params[paramName]);
      
      if (!resource) {
        throw new Error('Recurso no encontrado');
      }

      // Verificar si el usuario es el propietario
      if (resource.user && resource.user.toString() !== req.user.id) {
        throw new UnauthorizedError('No tienes permiso para realizar esta acción.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
