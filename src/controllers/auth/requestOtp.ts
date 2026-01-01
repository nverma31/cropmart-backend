import { Request, Response, NextFunction } from 'express';

import { OtpService } from 'services/auth/OtpService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;

    if (!phone) {
        const customError = new CustomError(400, 'Validation', 'Phone number is required');
        return next(customError);
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(phone)) {
        const customError = new CustomError(400, 'Validation', 'Invalid phone number format');
        return next(customError);
    }

    try {
        // Generate OTP
        const otp = await OtpService.createOtp(phone);

        // Send OTP (mocked in development)
        await OtpService.sendOtp(phone, otp);

        // In development mode, include OTP in response for testing
        const isDevelopment = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development';

        res.customSuccess(200, 'OTP sent successfully', {
            phone,
            expiresInMinutes: 5,
            // Only include OTP in development for testing
            ...(isDevelopment && { otp }),
        });
    } catch (err) {
        const customError = new CustomError(500, 'Raw', 'Failed to send OTP', null, err);
        return next(customError);
    }
};
