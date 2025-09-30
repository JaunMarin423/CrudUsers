import { IUser } from '../interfaces/user.interface.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '90d';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  username: string;
  phoneNumber: string;
  lastName: string;
  motherLastName?: string;
}

// Función para generar token JWT
const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    JWT_SECRET,
    { expiresIn: '90d' } as jwt.SignOptions
  );
};

export class AuthService {
  /**
   * Register a new user
   */
  async register(userData: RegisterInput): Promise<{ user: IUser; token: string }> {
    try {
      // Validate required fields
      const validationErrors: Array<{ msg: string; param: string }> = [];
      
      // Required fields validation
      if (!userData.email) validationErrors.push({ msg: 'El correo electrónico es obligatorio', param: 'email' });
      if (!userData.username) validationErrors.push({ msg: 'El nombre de usuario es obligatorio', param: 'username' });
      if (!userData.phoneNumber) validationErrors.push({ msg: 'El número de teléfono es obligatorio', param: 'phoneNumber' });
      if (!userData.password) validationErrors.push({ msg: 'La contraseña es obligatoria', param: 'password' });
      if (!userData.name) validationErrors.push({ msg: 'El nombre es obligatorio', param: 'name' });
      if (!userData.lastName) validationErrors.push({ msg: 'El apellido paterno es obligatorio', param: 'lastName' });
      
      // Field format validation
      if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        validationErrors.push({ msg: 'Por favor ingrese un correo electrónico válido', param: 'email' });
      }
      
      if (userData.phoneNumber && !/^[0-9]{10}$/.test(userData.phoneNumber)) {
        validationErrors.push({ msg: 'El número de teléfono debe tener 10 dígitos', param: 'phoneNumber' });
      }
      
      if (userData.username && !/^[a-zA-Z0-9_]+$/.test(userData.username)) {
        validationErrors.push({ msg: 'El nombre de usuario solo puede contener letras, números y guiones bajos', param: 'username' });
      }
      
      // Check for validation errors
      if (validationErrors.length > 0) {
        const error = new Error('Validation failed');
        (error as any).validationErrors = validationErrors;
        throw error;
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        throw new Error('El correo o nombre de usuario ya está en uso');
      }

      // Create user (password will be hashed by the model pre-save hook)
      const user = await User.create({
        ...userData
      });

      // Generate token
      const token = generateToken(user._id);

      // Remove password from output
      const userObj = user.toObject();
      const { password, ...userWithoutPassword } = userObj;

      return { user: userWithoutPassword as IUser, token };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(identifier: string, password: string): Promise<{ user: IUser; token: string }> {
    try {
      // Find user by email or username
      const user = await User.findOne({
        $or: [
          { email: identifier },
          { username: identifier }
        ]
      }).select('+password');

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Credenciales inválidas');
      }


      // Generate token
      const token = generateToken(user._id);

      // Convert to plain object and remove password
      const userObj = user.toObject();
      const { password: _, ...userWithoutPassword } = userObj;

      // Cast to IUser since we know the shape matches
      return { 
        user: userWithoutPassword as unknown as IUser, 
        token 
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }
}

export default new AuthService();
