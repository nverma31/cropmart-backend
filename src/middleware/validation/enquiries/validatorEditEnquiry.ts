import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const validatorEditEnquiry = (req: Request, res: Response, next: NextFunction) => {
  const { quantity, quantityUnit, expectedPrice, notes, status } = req.body;

  const errorsValidation: { [key: string]: string }[] = [];

  // Explicitly forbid status changes
  if (status !== undefined) {
    errorsValidation.push({ status: 'Status cannot be changed via this endpoint. Use PATCH /v1/enquiries/:id/status' });
  }

  // Validate quantity if provided
  if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
    errorsValidation.push({ quantity: 'Quantity must be a non-negative number' });
  }

  // Validate expectedPrice if provided
  if (expectedPrice !== undefined && (typeof expectedPrice !== 'number' || expectedPrice < 0)) {
    errorsValidation.push({ expectedPrice: 'Expected price must be a non-negative number' });
  }

  // Validate quantityUnit if provided
  if (quantityUnit !== undefined && typeof quantityUnit !== 'string') {
    errorsValidation.push({ quantityUnit: 'Quantity unit must be a string' });
  }

  // Validate notes if provided
  if (notes !== undefined && typeof notes !== 'string') {
    errorsValidation.push({ notes: 'Notes must be a string' });
  }

  if (errorsValidation.length > 0) {
    const customError = new CustomError(400, 'Validation', 'Invalid input', null, null, errorsValidation);
    return next(customError);
  }

  return next();
};
