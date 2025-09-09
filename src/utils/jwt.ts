import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface.js';

// Interfaz para el payload del token
interface TokenPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

/**
 * Genera un token JWT para el usuario
 * @param user - Usuario para el que se generará el token
 * @returns Token JWT
 */
export const generateToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const options: SignOptions = {
    expiresIn: '24h' // Hardcoded to avoid type issues
  };
  return jwt.sign(payload, secret, options);
};

/**
 * Verifica y decodifica un token JWT
 * @param token - Token JWT a verificar
 * @returns Payload del token si es válido, null en caso contrario
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Extrae el token del encabezado de autorización
 * @param authHeader - Encabezado de autorización (formato: 'Bearer token')
 * @returns Token si es válido, null en caso contrario
 */
export const getTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

export default {
  generateToken,
  verifyToken,
  getTokenFromHeader,
};
