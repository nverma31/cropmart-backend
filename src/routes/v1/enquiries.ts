import { Router } from 'express';

import { list, show, create, updateStatus } from 'controllers/enquiries';
import { editEnquiry } from 'controllers/enquiries/editEnquiry';
import { checkJwt } from 'middleware/checkJwt';
import { checkEnquiryOwnership } from 'middleware/checkOwnership';
import { checkRole } from 'middleware/checkRole';
import { validatorCreateEnquiry, validatorEditEnquiry } from 'middleware/validation/enquiries';
import { Roles } from 'orm/entities/users/types';

const router = Router();

// List all enquiries (Role based filtering logic to be improved)
router.get('/', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY, Roles.FARMER])], list);

// Create enquiry (Intermediaries only)
router.post('/', [checkJwt, checkRole([Roles.INTERMEDIARY, Roles.ADMIN]), validatorCreateEnquiry], create);

// Get single enquiry
router.get(
  '/:id([0-9]+)',
  [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY, Roles.FARMER]), checkEnquiryOwnership],
  show,
);

// Edit enquiry content (Admin only)
router.put('/:id([0-9]+)', [checkJwt, checkRole([Roles.ADMIN]), validatorEditEnquiry], editEnquiry);

// Update status
router.patch('/:id([0-9]+)/status', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY])], updateStatus);

export default router;
