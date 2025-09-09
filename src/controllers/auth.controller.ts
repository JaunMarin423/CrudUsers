import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import authService from '../services/auth.service.js';
import { ValidationError, BadRequestError } from '../utils/errorHandler.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

class AuthController {
  /**
   * Registra un nuevo usuario
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by the validate middleware
      const userData = req.body;
      const { user, token } = await authService.register(userData);

      res.status(201).json({
        status: 'success',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Inicia sesión de un usuario
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validation is handled by the validate middleware
      const { identifier, password } = req.body;

      if (!identifier || !password) {
        throw new BadRequestError('Por favor proporcione un identificador y una contraseña');
      }

      const { user, token } = await authService.login(identifier, password);

      res.status(200).json({
        status: 'success',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  };

}

export default new AuthController();
