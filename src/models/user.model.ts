import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, IUserDocument, IUserModel, UserRole } from '../interfaces/user.interface.js';
import config from '../config/config.js';
import { handleValidationErrors } from '../utils/validationError.js';

// Define the schema
const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'El apellido paterno es obligatorio'],
      trim: true,
      maxlength: [40, 'El apellido paterno no puede tener más de 40 caracteres'],
      match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido paterno solo puede contener letras y espacios'],
    },
    motherLastName: {
      type: String,
      trim: true,
      maxlength: [40, 'El apellido materno no puede tener más de 40 caracteres'],
      match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, 'El apellido materno solo puede contener letras y espacios'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'El número de teléfono es obligatorio'],
      unique: true,
      trim: true,
      minlength: [10, 'El número de teléfono debe tener 10 dígitos'],
      maxlength: [10, 'El número de teléfono debe tener 10 dígitos'],
      match: [/^[0-9]+$/, 'El número de teléfono solo puede contener dígitos'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [30, 'El nombre de usuario no puede tener más de 30 caracteres'],
      match: [/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      maxlength: [20, 'La contraseña no puede tener más de 20 caracteres'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function (): string {
  // Create token with expiration
  return jwt.sign(
    { id: this._id },
    config.jwt.secret,
    { expiresIn: '30d' } // Hardcoded to avoid type issues
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Prevent duplicate emails
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ phoneNumber: 1 }, { unique: true });

// Create and export the model
export const User: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default User;
