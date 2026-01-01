import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorUpdateFarmer = (req: Request, res: Response, next: NextFunction) => {
    const { address, district, state, pincode, landHolding } = req.body;
    const errorsValidation: ErrorValidation[] = [];

    // Optional fields validation
    if (pincode && !validator.isLength(pincode, { min: 6, max: 10 })) {
        errorsValidation.push({ pincode: 'Pincode must be between 6 and 10 characters' });
    }

    if (state && validator.isEmpty(state)) {
        errorsValidation.push({ state: 'State cannot be empty' });
    }

    if (district && validator.isEmpty(district)) {
        errorsValidation.push({ district: 'District cannot be empty' });
    }

    if (errorsValidation.length !== 0) {
        const customError = new CustomError(400, 'Validation', 'Update farmer validation error', null, null, errorsValidation);
        return next(customError);
    }
    return next();
};
