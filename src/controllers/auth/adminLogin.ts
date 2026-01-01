import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Roles } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const customError = new CustomError(400, 'Validation', 'Email and password are required');
        return next(customError);
    }

    const userRepository = getRepository(User);

    try {
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            const customError = new CustomError(401, 'Unauthorized', 'Invalid email or password');
            return next(customError);
        }

        // Verify user is an admin
        if (user.role !== Roles.ADMIN) {
            const customError = new CustomError(403, 'Forbidden', 'Access denied. Admin only.');
            return next(customError);
        }

        // Verify password
        if (!user.checkIfPasswordMatch(password)) {
            const customError = new CustomError(401, 'Unauthorized', 'Invalid email or password');
            return next(customError);
        }

        // Check if user is active
        if (!user.isActive) {
            const customError = new CustomError(403, 'Forbidden', 'Account is deactivated');
            return next(customError);
        }

        // Generate JWT
        const jwtPayload: JwtPayload = {
            id: user.id,
            role: user.role,
        };

        const token = createJwtToken(jwtPayload);

        res.customSuccess(200, 'Login successful', {
            token: `Bearer ${token}`,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (err) {
        const customError = new CustomError(500, 'Raw', 'Authentication failed', null, err);
        return next(customError);
    }
};
