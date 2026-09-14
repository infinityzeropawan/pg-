import { Router } from 'express';
import { authenticateJwt, authorizeRoles } from '../../middleware/auth.middleware';
import {
  getStaffDashboard,
  getStock,
  updateStock,
  getStaffTasks,
  updateTaskStatus,
} from './staff.controller';

const router = Router();

router.use(authenticateJwt, authorizeRoles('STAFF', 'MANAGER', 'OWNER', 'SUPERADMIN'));

router.get('/dashboard', getStaffDashboard);
router.get('/stock', getStock);
router.patch('/stock/:id', updateStock);
router.get('/tasks', getStaffTasks);
router.patch('/tasks/:id', updateTaskStatus);

export default router;
