import { IUser } from '../interfaces/user.interface.js';
import User from '../models/user.model.js';

export class UserService {
  /**
   * Get all users
   */
  async getUsers(): Promise<IUser[]> {
    try {
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      
      return users as unknown as IUser[];
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error('Error getting users');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IUser> {
    try {
      const user = await User.findById(userId)
        .select('-password')
        .lean()
        .exec();
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user as unknown as IUser;
    } catch (error) {
      console.error(`Error getting user ${userId}:`, error);
      throw new Error('Error getting user');
    }
  }

  /**
   * Update user
   */
  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    try {
      // Don't allow password updates through this method
      if (updateData.password) {
        delete updateData.password;
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .select('-password')
        .lean()
        .exec();
      
      if (!updatedUser) {
        throw new Error('User not found');
      }
      
      return updatedUser as unknown as IUser;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw new Error('Error updating user');
    }
  }
}
