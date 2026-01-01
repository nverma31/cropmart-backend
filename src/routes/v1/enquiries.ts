import { Router } from 'express';

import { list, show, create, updateStatus } from 'controllers/enquiries';
import { checkJwt } from 'middleware/checkJwt';
import { checkEnquiryOwnership } from 'middleware/checkOwnership';
import { checkRole } from 'middleware/checkRole';
import { Roles } from 'orm/entities/users/types';

const router = Router();

import { validatorCreateEnquiry } from 'middleware/validation/enquiries';

// List all enquiries (Role based filtering logic to be improved)
router.get('/', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY, Roles.FARMER])], list);

// Create enquiry (Intermediaries only)
router.post('/', [checkJwt, checkRole([Roles.INTERMEDIARY, Roles.ADMIN]), validatorCreateEnquiry], create);

// Get single enquiry
router.get('/:id([0-9]+)', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY, Roles.FARMER]), checkEnquiryOwnership], show);

// Update status
router.patch('/:id([0-9]+)/status', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY])], updateStatus);

export default router;
