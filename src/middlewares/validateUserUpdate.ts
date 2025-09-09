import { Request, Response, NextFunction } from 'express';
import { validateName, validatePhone, validateEmail, validateUsername, validatePassword } from './validateRequest.js';

type ValidationError = {
  msg: string;
  param: string;
};

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void | Response => {
  const { name, lastName, motherLastName, phoneNumber, email, username, password } = req.body;
  const errors: ValidationError[] = [];

  // Only validate fields that are present in the request
  if (name !== undefined) {
    const nameError = validateName(name, 'nombre');
    if (nameError) errors.push({ msg: nameError, param: 'name' });
  }
  
  if (lastName !== undefined) {
    const lastNameError = validateName(lastName, 'apellido paterno');
    if (lastNameError) errors.push({ msg: lastNameError, param: 'lastName' });
  }
  
  if (motherLastName !== undefined) {
    const motherLastNameError = validateName(motherLastName, 'apellido materno');
    if (motherLastNameError) errors.push({ msg: motherLastNameError, param: 'motherLastName' });
  }
  
  if (phoneNumber !== undefined) {
    const phoneError = validatePhone(phoneNumber);
    if (phoneError) errors.push({ msg: phoneError, param: 'phoneNumber' });
  }
  
  if (email !== undefined) {
    const emailError = validateEmail(email);
    if (emailError) errors.push({ msg: emailError, param: 'email' });
  }
  
  if (username !== undefined) {
    const usernameError = validateUsername(username);
    if (usernameError) errors.push({ msg: usernameError, param: 'username' });
  }
  
  if (password !== undefined) {
    const passwordError = validatePassword(password);
    if (passwordError) errors.push({ msg: passwordError, param: 'password' });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }
  
  next();
};
