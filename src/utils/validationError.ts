import { HttpException } from './error.utils.js';

export class ValidationError extends HttpException {
  constructor(public errors: Array<{ msg: string; param: string }>) {
    super(400, 'Validation Error', errors);
  }
}

export const handleValidationErrors = (errors: Array<{ msg: string; param: string }>) => {
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
};
