import { Router } from 'express';
import { login, logout, getCurrentUser, changePassword } from './auth.controller';
import { authenticateJwt } from '../../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/logout', authenticateJwt, logout);
router.get('/me', authenticateJwt, getCurrentUser);
router.post('/change-password', authenticateJwt, changePassword);

export default router;
