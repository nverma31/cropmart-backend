import { Router } from 'express';

import { list, show, update } from 'controllers/intermediaries';
import { createIntermediary } from 'controllers/intermediaries/createIntermediary';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorUpdateIntermediary, validatorCreateIntermediary } from 'middleware/validation/intermediaries';
import { Roles } from 'orm/entities/users/types';

const router = Router();

// Create intermediary (Admin only)
router.post('/', [checkJwt, checkRole([Roles.ADMIN]), validatorCreateIntermediary], createIntermediary);

// List all (Admin only)
router.get('/', [checkJwt, checkRole([Roles.ADMIN])], list);

// Get details (Admin or self - ownership check simplified here for now)
router.get('/:id([0-9]+)', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY])], show);

// Update profile (Admin or self)
router.patch(
  '/:id([0-9]+)',
  [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY]), validatorUpdateIntermediary],
  update,
);

export default router;
