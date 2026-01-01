import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Farmer } from 'orm/entities/farmers/Farmer';
import { Intermediary } from 'orm/entities/intermediaries/Intermediary';
import { Role, Roles } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { OtpService } from 'services/auth/OtpService';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { phone, otp, role } = req.body;

    if (!phone || !otp) {
        const customError = new CustomError(400, 'Validation', 'Phone and OTP are required');
        return next(customError);
    }

    // Validate role if provided (for new user registration)
    const validRoles: Role[] = [Roles.FARMER, Roles.INTERMEDIARY];
    const userRole: Role = role && validRoles.includes(role) ? role : Roles.FARMER;

    try {
        // Verify OTP
        const isValid = await OtpService.verifyOtp(phone, otp);

        if (!isValid) {
            const customError = new CustomError(401, 'Unauthorized', 'Invalid or expired OTP');
            return next(customError);
        }

        const userRepository = getRepository(User);
        const farmerRepository = getRepository(Farmer);
        const intermediaryRepository = getRepository(Intermediary);

        // Find or create user
        let user = await userRepository.findOne({ where: { phone } });

        if (!user) {
            // Create new user
            user = new User();
            user.phone = phone;
            user.role = userRole;
            user.isActive = true;
            user = await userRepository.save(user);

            // Create corresponding Farmer or Intermediary record
            if (userRole === Roles.FARMER) {
                const farmer = new Farmer();
                farmer.userId = user.id;
                await farmerRepository.save(farmer);
            } else if (userRole === Roles.INTERMEDIARY) {
                const intermediary = new Intermediary();
                intermediary.userId = user.id;
                await intermediaryRepository.save(intermediary);
            }
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
                phone: user.phone,
                name: user.name,
                role: user.role,
                isActive: user.isActive,
            },
        });
    } catch (err) {
        const customError = new CustomError(500, 'Raw', 'Authentication failed', null, err);
        return next(customError);
    }
};
