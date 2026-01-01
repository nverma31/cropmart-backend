import { Request, Response, NextFunction } from 'express';

import { FarmerService } from 'services/farmers/FarmerService';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { getPaginationOptions, getFilters } from 'utils/pagination';
import { Roles } from 'orm/entities/users/types';

const farmerService = new FarmerService();

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: userId, role } = req.jwtPayload;
        const paginationOptions = getPaginationOptions(req);
        const reqFilters = getFilters(req);

        let where: any = { ...reqFilters };

        // Role filtering: Intermediary sees linked farmers
        if (role === Roles.INTERMEDIARY) {
            // Find farmers linked to this intermediary
            // Need to find intermediaryId for this userId first.
            const intermediaryService = new (require('services/intermediaries/IntermediaryService').IntermediaryService)();
            const intermediary = await intermediaryService.findByUserId(userId);
            if (intermediary) {
                where = { ...where, intermediaryId: intermediary.id };
            } else {
                // No intermediary profile found, return empty
                where = { ...where, id: -1 };
            }
        }

        const result = await farmerService.list(where, paginationOptions);
        res.customSuccess(200, 'List of farmers.', result);
    } catch (err) {
        const customError = new CustomError(400, 'Raw', 'Error listing farmers', null, err);
        return next(customError);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    // Middleware checkFarmerAccess attaches farmer to request
    const farmer = req.farmer;
    res.customSuccess(200, 'Farmer found', farmer);
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { address, district, state, pincode, landHolding } = req.body;

    try {
        const farmer = await farmerService.update(parseInt(id), {
            address,
            district,
            state,
            pincode,
            landHolding,
        });
        res.customSuccess(200, 'Farmer profile updated', farmer);
    } catch (err) {
        const customError = new CustomError(400, 'Raw', 'Error updating farmer', null, err);
        return next(customError);
    }
};
