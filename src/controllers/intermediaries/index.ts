import { Request, Response, NextFunction } from 'express';

import { IntermediaryService } from 'services/intermediaries/IntermediaryService';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { getPaginationOptions, getFilters } from 'utils/pagination';

const intermediaryService = new IntermediaryService();

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paginationOptions = getPaginationOptions(req);
        const filters = getFilters(req);

        const result = await intermediaryService.list(filters, paginationOptions);
        res.customSuccess(200, 'List of intermediaries.', result);
    } catch (err) {
        const customError = new CustomError(400, 'Raw', 'Error listing intermediaries', null, err);
        return next(customError);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const intermediary = await intermediaryService.findOne(parseInt(id));
        res.customSuccess(200, 'Intermediary found', intermediary);
    } catch (err) {
        const customError = new CustomError(404, 'General', 'Intermediary not found', null, err);
        return next(customError);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { businessName, businessType, gstNumber, address, district, state, pincode } = req.body;

    try {
        const intermediary = await intermediaryService.update(parseInt(id), {
            businessName,
            businessType,
            gstNumber,
            address,
            district,
            state,
            pincode,
        });
        res.customSuccess(200, 'Intermediary profile updated', intermediary);
    } catch (err) {
        const customError = new CustomError(400, 'Raw', 'Error updating intermediary', null, err);
        return next(customError);
    }
};
