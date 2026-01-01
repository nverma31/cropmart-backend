import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../orm/entities/users/User';
import { CustomError } from '../utils/response/custom-error/CustomError';

/**
 * Middleware to check if the authenticated user's account is still active
 * Should be used after checkJwt middleware
 */
export const checkActive = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.jwtPayload;

    try {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id } });

        if (!user) {
            const customError = new CustomError(401, 'Unauthorized', 'User not found');
            return next(customError);
        }

        if (!user.isActive) {
            const customError = new CustomError(403, 'Forbidden', 'Account is deactivated');
            return next(customError);
        }

        return next();
    } catch (err) {
        const customError = new CustomError(500, 'Raw', 'Error checking user status', null, err);
        return next(customError);
    }
};
