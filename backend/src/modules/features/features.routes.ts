import { Router } from 'express';
import { authenticateJwt } from '../../middleware/auth.middleware';
import { getMyFeatures } from './features.controller';

const router = Router();

router.use(authenticateJwt);

// Effective plan features for the current tenant/user.
router.get('/me', getMyFeatures);

export default router;
