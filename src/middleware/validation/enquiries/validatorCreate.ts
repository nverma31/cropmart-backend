import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreateEnquiry = (req: Request, res: Response, next: NextFunction) => {
    const { farmerId, productType, quantity, expectedPrice } = req.body;
    const errorsValidation: ErrorValidation[] = [];

    if (!farmerId) {
        errorsValidation.push({ farmerId: 'Farmer ID is required' });
    }

    if (!productType || validator.isEmpty(productType)) {
        errorsValidation.push({ productType: 'Product type is required' });
    }

    if (quantity === undefined || quantity === null || quantity <= 0) {
        errorsValidation.push({ quantity: 'Quantity must be greater than 0' });
    }

    if (expectedPrice === undefined || expectedPrice === null || expectedPrice <= 0) {
        errorsValidation.push({ expectedPrice: 'Expected price must be greater than 0' });
    }

    if (errorsValidation.length !== 0) {
        const customError = new CustomError(400, 'Validation', 'Create enquiry validation error', null, null, errorsValidation);
        return next(customError);
    }
    return next();
};
