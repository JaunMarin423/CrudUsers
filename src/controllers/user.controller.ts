import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model.js';
import { IUser } from '../interfaces/user.interface.js';
import { HttpException } from '../utils/error.utils.js';
import { body } from 'express-validator/check/index.js';
import { validationResult } from 'express-validator/src/validation-result.js';

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    if (error instanceof HttpException) {
      return next(error);
    } else if (error instanceof Error) {
      return next(new HttpException(500, error.message));
    } else {
      return next(new HttpException(500, 'Server error'));
    }
  }
};

/**
 * @desc    Get single user
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof HttpException) {
      return next(error);
    } else if (error instanceof Error) {
      return next(new HttpException(500, error.message));
    } else {
      return next(new HttpException(500, 'Server error'));
    }
  }
};

// Validation schema for user creation
const createUserSchema = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string'),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role')
];

// Validation schema for user update (same as create but without password)
const updateUserSchema = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string'),
    
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please include a valid email'),
    
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role')
];

/**
 * @desc    Create user
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
export const createUser = [
  ...createUserSchema,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new HttpException(400, 'User already exists');
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user',
      });

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(201).json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return next(error);
      } else if (error instanceof Error) {
        return next(new HttpException(500, error.message));
      } else {
        return next(new HttpException(500, 'Server error'));
      }
    }
  },
];

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
export const updateUser = [
  ...updateUserSchema,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, role } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      // Update fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;

      const updatedUser = await user.save();

      // Remove password from response
      const userResponse = updatedUser.toObject();
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return next(error);
      } else if (error instanceof Error) {
        return next(new HttpException(500, error.message));
      } else {
        return next(new HttpException(500, 'Server error'));
      }
    }
  },
];

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    await user.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    if (error instanceof HttpException) {
      return next(error);
    } else if (error instanceof Error) {
      return next(new HttpException(500, error.message));
    } else {
      return next(new HttpException(500, 'Server error'));
    }
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/users/me
 * @access  Private
 */
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById((req as any).user.id).select('-password');

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof HttpException) {
      return next(error);
    } else if (error instanceof Error) {
      return next(new HttpException(500, error.message));
    } else {
      return next(new HttpException(500, 'Server error'));
    }
  }
};
