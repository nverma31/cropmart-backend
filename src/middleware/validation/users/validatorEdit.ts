import { Request, Response, NextFunction } from 'express';
import { getRepository, Not } from 'typeorm';
import validator from 'validator';

import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { email, phone, name } = req.body;
  const userId = parseInt(req.params.id);
  const errorsValidation: ErrorValidation[] = [];
  const userRepository = getRepository(User);

  // Validate email format if provided
  if (email && !validator.isEmail(email)) {
    errorsValidation.push({ email: 'Invalid email format' });
  }

  // Check if email is already taken by another user
  if (email) {
    const existingEmailUser = await userRepository.findOne({
      where: { email, id: Not(userId) }
    });
    if (existingEmailUser) {
      errorsValidation.push({ email: `Email '${email}' is already in use` });
    }
  }

  // Check if phone is already taken by another user
  if (phone) {
    const existingPhoneUser = await userRepository.findOne({
      where: { phone, id: Not(userId) }
    });
    if (existingPhoneUser) {
      errorsValidation.push({ phone: `Phone '${phone}' is already in use` });
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit user validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
