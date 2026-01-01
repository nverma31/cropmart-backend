import { Request, Response, NextFunction } from 'express';

import { PurchaseEnquiry } from 'orm/entities/enquiries/PurchaseEnquiry';
import { EnquiryService } from 'services/enquiries/EnquiryService';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { getPaginationOptions, getFilters } from 'utils/pagination';
import { Roles } from 'orm/entities/users/types';

const enquiryService = new EnquiryService();

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: userId, role } = req.jwtPayload;
        const paginationOptions = getPaginationOptions(req);
        const reqFilters = getFilters(req);

        let where: any = { ...reqFilters };

        // Role-based filtering
        if (role === Roles.FARMER) {
            // Find filtered by this user's farmer profile
            // We rely on relation filtering: farmer -> user -> id
            where = { ...where, farmer: { user: { id: userId } } };
        } else if (role === Roles.INTERMEDIARY) {
            // Intermediaries see what they created
            where = { ...where, createdByUserId: userId };
        }
        // Admin sees all (no extra filter)

        const result = await enquiryService.list(where, paginationOptions);
        res.customSuccess(200, 'List of enquiries.', result);
    } catch (err) {
        const customError = new CustomError(400, 'Raw', 'Error listing enquiries', null, err);
        return next(customError);
    }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
    // Middleware checkEnquiryOwnership already attached the enquiry to the request if found and authorized
    const enquiry = req.enquiry;
    res.customSuccess(200, 'Enquiry found', enquiry);
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
    const { farmerId, productType, quantity, quantityUnit, expectedPrice, notes } = req.body;
    const { id: userId } = req.jwtPayload;

    try {
        const enquiry = await enquiryService.create({
            farmerId,
            createdByUser: { id: userId } as any, // Only need ID for relation
            createdByUserId: userId,
            productType,
            quantity,
            quantityUnit,
            expectedPrice,
            notes,
        });
        res.customSuccess(201, 'Enquiry created successfully', enquiry);
    } catch (err) {
        const customError = new CustomError(400, 'Raw', 'Error creating enquiry', null, err);
        return next(customError);
    }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const enquiry = await enquiryService.updateStatus(parseInt(id), status);
        res.customSuccess(200, 'Enquiry status updated', enquiry);
    } catch (err) {
        const customError = new CustomError(400, 'Raw', 'Error updating status', null, err);
        return next(customError);
    }
};
