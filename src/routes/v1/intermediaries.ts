import { Router } from 'express';

import { list, show, update } from 'controllers/intermediaries';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { Roles } from 'orm/entities/users/types';

const router = Router();

// List all (Admin only)
router.get('/', [checkJwt, checkRole([Roles.ADMIN])], list);

// Get details (Admin or self - ownership check simplified here for now)
router.get('/:id([0-9]+)', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY])], show);

import { validatorUpdateIntermediary } from 'middleware/validation/intermediaries';

// Update profile (Admin or self)
router.patch('/:id([0-9]+)', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY]), validatorUpdateIntermediary], update);

export default router;
