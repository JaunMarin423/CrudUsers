import { Document, Types, Model } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUserInput {
  name: string;
  lastName: string;
  motherLastName?: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
}

export interface IUser extends IUserInput, Document {
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: number;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

export interface IUserDocument extends IUser, IUserMethods {}

export interface IUserModel extends Model<IUserDocument> {
  // Add any static methods here
}
