import { getRepository, MoreThan } from 'typeorm';

import { OtpToken } from 'orm/entities/auth/OtpToken';

const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;

export class OtpService {
    /**
     * Generate a random numeric OTP
     */
    private static generateRandomOtp(): string {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < OTP_LENGTH; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        return otp;
    }

    /**
     * Create and store a new OTP for the given phone number
     * Returns the plain OTP (for mocked SMS delivery)
     */
    static async createOtp(phone: string): Promise<string> {
        const otpRepository = getRepository(OtpToken);

        // Invalidate any existing unused OTPs for this phone
        await otpRepository.update(
            { phone, isUsed: false },
            { isUsed: true }
        );

        // Generate new OTP
        const plainOtp = this.generateRandomOtp();

        // Create OTP token
        const otpToken = new OtpToken();
        otpToken.phone = phone;
        otpToken.otp = plainOtp;
        otpToken.hashOtp();
        otpToken.expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        otpToken.isUsed = false;

        await otpRepository.save(otpToken);

        return plainOtp;
    }

    /**
     * Verify OTP for the given phone number
     * Returns true if valid, false otherwise
     */
    static async verifyOtp(phone: string, plainOtp: string): Promise<boolean> {
        const otpRepository = getRepository(OtpToken);

        // Find valid, unused OTP for this phone
        const otpTokens = await otpRepository.find({
            where: {
                phone,
                isUsed: false,
                expiresAt: MoreThan(new Date()),
            },
            order: { createdAt: 'DESC' },
            take: 5, // Check last 5 OTPs (in case multiple were generated)
        });

        for (const otpToken of otpTokens) {
            if (otpToken.checkIfOtpMatch(plainOtp)) {
                // Mark as used
                otpToken.isUsed = true;
                await otpRepository.save(otpToken);
                return true;
            }
        }

        return false;
    }

    /**
     * Mock SMS delivery - in production, integrate with SMS provider
     * For development, logs to console and returns the OTP
     */
    static async sendOtp(phone: string, otp: string): Promise<void> {
        // TODO: Integrate with SMS provider (Twilio, MSG91, etc.)
        console.log(`[MOCK SMS] Sending OTP ${otp} to ${phone}`);

        // In development, we just log it
        // In production, you would call your SMS provider API here
    }
}
