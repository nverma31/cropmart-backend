import { Router } from 'express';

import auth from './auth';
import enquiries from './enquiries';
import farmers from './farmers';
import intermediaries from './intermediaries';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/farmers', farmers);
router.use('/intermediaries', intermediaries);
router.use('/enquiries', enquiries);

export default router;
