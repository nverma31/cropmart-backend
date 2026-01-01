import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorUpdateIntermediary = (req: Request, res: Response, next: NextFunction) => {
    const { businessName, businessType, gstNumber, pincode } = req.body;
    const errorsValidation: ErrorValidation[] = [];

    if (businessName && validator.isEmpty(businessName)) {
        errorsValidation.push({ businessName: 'Business name cannot be empty' });
    }

    if (pincode && !validator.isLength(pincode, { min: 6, max: 10 })) {
        errorsValidation.push({ pincode: 'Pincode must be between 6 and 10 characters' });
    }

    // GST validation (simple length check)
    if (gstNumber && !validator.isLength(gstNumber, { min: 15, max: 15 })) {
        errorsValidation.push({ gstNumber: 'GST Number must be exactly 15 characters' });
    }

    if (errorsValidation.length !== 0) {
        const customError = new CustomError(400, 'Validation', 'Update intermediary validation error', null, null, errorsValidation);
        return next(customError);
    }
    return next();
};
