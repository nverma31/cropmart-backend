import { Router } from 'express';

import { adminLogin } from 'controllers/auth/adminLogin';
import { requestOtp } from 'controllers/auth/requestOtp';
import { verifyOtp } from 'controllers/auth/verifyOtp';

const router = Router();

// Mobile App Authentication (OTP-based)
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

// Admin Authentication (Email/Password)
router.post('/admin/login', adminLogin);

export default router;
