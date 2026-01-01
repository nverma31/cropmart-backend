import { Router } from 'express';

import { list, show, update } from 'controllers/farmers';
import { checkJwt } from 'middleware/checkJwt';
import { checkFarmerAccess } from 'middleware/checkOwnership';
import { checkRole } from 'middleware/checkRole';
import { Roles } from 'orm/entities/users/types';

const router = Router();

// List farmers (Intermediaries see their linked farmers - logic matches all for now, to be refined)
router.get('/', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY])], list);

// Get farmer details
router.get('/:id([0-9]+)', [checkJwt, checkRole([Roles.ADMIN, Roles.INTERMEDIARY, Roles.FARMER]), checkFarmerAccess], show);

import { validatorUpdateFarmer } from 'middleware/validation/farmers';

// Update farmer profile
router.patch('/:id([0-9]+)', [checkJwt, checkRole([Roles.ADMIN, Roles.FARMER]), checkFarmerAccess, validatorUpdateFarmer], update);

export default router;
