import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, Result, ValidationError } from 'express-validator';

type CustomValidationError = {
  param: string;
  msg: string;
  value?: any;
};

type CustomValidationResult = {
  isEmpty: () => boolean;
  array: () => CustomValidationError[];
};

// Validation middleware for express-validator
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    const errors = result.array().map(err => {
      // Handle both FieldValidationError and AlternativeValidationError types
      const param = 'path' in err ? err.path : 'param' in err ? err.param : 'unknown';
      return {
        field: param,
        message: err.msg
      };
    });

    return res.status(400).json({
      status: 'error',
      errors
    });
  };
};

// Field validation functions
export const validateName = (name: string, field: string): string | null => {
  if (!name) return `El ${field} es obligatorio`;
  if (name.length > 40) return `El ${field} no puede tener más de 40 caracteres`;
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    return `El ${field} solo puede contener letras y espacios`;
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'El número de teléfono es obligatorio';
  if (phone.length !== 10) return 'El número de teléfono debe tener 10 dígitos';
  if (!/^[0-9]+$/.test(phone)) return 'El número de teléfono solo puede contener dígitos';
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return 'El correo electrónico es obligatorio';
  if (email.length > 40) return 'El correo electrónico no puede tener más de 40 caracteres';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Por favor ingrese un correo electrónico válido';
  return null;
};

export const validateUsername = (username: string): string | null => {
  if (!username) return 'El nombre de usuario es obligatorio';
  if (username.length > 30) return 'El nombre de usuario no puede tener más de 30 caracteres';
  if (/[^a-zA-Z0-9]/.test(username)) {
    return 'El nombre de usuario no puede contener caracteres especiales';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (password.length > 100) return 'La contraseña no puede tener más de 100 caracteres';
  return null;
};

// Helper function to check if the request is for user update
export const isUserUpdateRequest = (req: Request): boolean => {
  return req.method === 'PUT' && req.path.match(/^\/api\/users\/[a-f\d]{24}$/) !== null;
};

// Custom validation function for user data
export const validateUserData = (req: Request) => {
  const errors: CustomValidationError[] = [];
  const { name, lastName, motherLastName, phoneNumber, email, username, password } = req.body;
  const isUpdate = isUserUpdateRequest(req);

  // For updates, only validate fields that are being updated
  if (isUpdate) {
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
  } else {
    // For create requests, validate all required fields
    const nameError = validateName(name, 'nombre');
    if (nameError) errors.push({ msg: nameError, param: 'name' });
    
    const lastNameError = validateName(lastName, 'apellido paterno');
    if (lastNameError) errors.push({ msg: lastNameError, param: 'lastName' });
    
    const phoneError = validatePhone(phoneNumber);
    if (phoneError) errors.push({ msg: phoneError, param: 'phoneNumber' });
    
    const emailError = validateEmail(email);
    if (emailError) errors.push({ msg: emailError, param: 'email' });
    
    const usernameError = validateUsername(username);
    if (usernameError) errors.push({ msg: usernameError, param: 'username' });
    
    const passwordError = validatePassword(password);
    if (passwordError) errors.push({ msg: passwordError, param: 'password' });
  }
  
  return {
    isEmpty: () => errors.length === 0,
    array: () => errors
  };
};

// Validation for login requests
export const validateLogin = (req: Request, res: Response, next: NextFunction): Response | void => {
  const { identifier, password } = req.body;
  const errors: CustomValidationError[] = [];

  if (!identifier) {
    errors.push({ msg: 'Se requiere un correo electrónico o nombre de usuario', param: 'identifier' });
  }

  if (!password) {
    errors.push({ msg: 'La contraseña es obligatoria', param: 'password' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors.map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
};

export const validate = (req: Request, res: Response, next: NextFunction): Response | void => {
  // Use login validation for login route
  if (req.path.endsWith('/login') && req.method === 'POST') {
    return validateLogin(req, res, next);
  }
  
  // Use regular validation for other routes
  const result = validateUserData(req);
  
  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: result.array()
    });
  }
  
  next();
};
