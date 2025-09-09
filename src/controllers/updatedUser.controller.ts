import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model.js';
import { HttpException } from '../utils/error.utils.js';

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, role, lastName, motherLastName, phoneNumber, username } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    // Update user
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (lastName !== undefined) user.lastName = lastName;
    if (motherLastName !== undefined) user.motherLastName = motherLastName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (username !== undefined) user.username = username;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof HttpException) {
      next(error);
    } else if (error instanceof Error) {
      console.error(error.message);
      next(new HttpException(500, error.message));
    } else {
      console.error('An unknown error occurred');
      next(new HttpException(500, 'Server error'));
    }
  }
};
