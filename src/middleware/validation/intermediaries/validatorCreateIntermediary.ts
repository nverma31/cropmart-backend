import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const validatorCreateIntermediary = (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.body;

  const errorsValidation: { [key: string]: string }[] = [];

  // Phone is required
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    errorsValidation.push({ phone: 'Phone number is required' });
  } else {
    // Basic phone validation
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(phone.trim())) {
      errorsValidation.push({ phone: 'Invalid phone number format' });
    }
  }

  if (errorsValidation.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Invalid input', null, null, errorsValidation);
    return next(customError);
  }

  return next();
};
