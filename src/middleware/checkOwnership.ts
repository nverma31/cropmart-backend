import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Farmer } from '../orm/entities/farmers/Farmer';
import { Intermediary } from '../orm/entities/intermediaries/Intermediary';
import { PurchaseEnquiry } from '../orm/entities/enquiries/PurchaseEnquiry';
import { Roles } from '../orm/entities/users/types';
import { CustomError } from '../utils/response/custom-error/CustomError';

/**
 * Middleware to check if user owns or has access to the requested resource
 * Used for endpoints like GET /enquiries/:id where users should only access their own data
 */
export const checkEnquiryOwnership = async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId, role } = req.jwtPayload;
    const enquiryId = parseInt(req.params.id);

    // Admins can access all enquiries
    if (role === Roles.ADMIN) {
        return next();
    }

    try {
        const enquiryRepository = getRepository(PurchaseEnquiry);
        const enquiry = await enquiryRepository.findOne({
            where: { id: enquiryId },
            relations: ['farmer', 'farmer.user', 'intermediary', 'intermediary.user'],
        });

        if (!enquiry) {
            const customError = new CustomError(404, 'General', 'Enquiry not found');
            return next(customError);
        }

        // Check ownership based on role
        if (role === Roles.FARMER) {
            // Farmer can only access their own enquiries
            if (enquiry.farmer?.user?.id !== userId) {
                const customError = new CustomError(403, 'Forbidden', 'Access denied to this enquiry');
                return next(customError);
            }
        } else if (role === Roles.INTERMEDIARY) {
            // Intermediary can access:
            // 1. Enquiries they created
            // 2. Enquiries of farmers linked to them
            const isCreator = enquiry.createdByUserId === userId;
            const isLinkedFarmer = enquiry.intermediary?.user?.id === userId;

            if (!isCreator && !isLinkedFarmer) {
                const customError = new CustomError(403, 'Forbidden', 'Access denied to this enquiry');
                return next(customError);
            }
        }

        // Attach enquiry to request for use in controller
        req.enquiry = enquiry;
        return next();
    } catch (err) {
        const customError = new CustomError(500, 'Raw', 'Error checking ownership', null, err);
        return next(customError);
    }
};

/**
 * Middleware to check if user owns or has access to a farmer profile
 */
export const checkFarmerAccess = async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId, role } = req.jwtPayload;
    const farmerId = parseInt(req.params.id);

    // Admins can access all farmers
    if (role === Roles.ADMIN) {
        return next();
    }

    try {
        const farmerRepository = getRepository(Farmer);
        const farmer = await farmerRepository.findOne({
            where: { id: farmerId },
            relations: ['user', 'intermediary', 'intermediary.user'],
        });

        if (!farmer) {
            const customError = new CustomError(404, 'General', 'Farmer not found');
            return next(customError);
        }

        if (role === Roles.FARMER) {
            // Farmer can only access their own profile
            if (farmer.user?.id !== userId) {
                const customError = new CustomError(403, 'Forbidden', 'Access denied');
                return next(customError);
            }
        } else if (role === Roles.INTERMEDIARY) {
            // Intermediary can access farmers linked to them
            if (farmer.intermediary?.user?.id !== userId) {
                const customError = new CustomError(403, 'Forbidden', 'Access denied');
                return next(customError);
            }
        }

        req.farmer = farmer;
        return next();
    } catch (err) {
        const customError = new CustomError(500, 'Raw', 'Error checking access', null, err);
        return next(customError);
    }
};
