import { Router } from 'express';
import { authenticateJwt, authorizeRoles } from '../../middleware/auth.middleware';
import {
  getDashboardStats,
  listProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
  listRooms,
  createRoom,
  updateBedStatus,
  listStaff,
  createStaff,
  listTenants,
  onboardTenant,
  listComplaints,
  updateComplaintStatus,
  listGateLogs,
  addGateLog,
} from './admin.controller';

const router = Router();

// Protected Admin / Owner / Manager Endpoints
router.use(authenticateJwt, authorizeRoles('OWNER', 'MANAGER', 'SUPERADMIN'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Properties CRUD
router.get('/properties', listProperties);
router.post('/properties', createProperty);
router.get('/properties/:id', getPropertyDetail);
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);

// Rooms & Beds
router.get('/properties/:propertyId/rooms', listRooms);
router.post('/rooms', createRoom);
router.patch('/beds/:bedId/status', updateBedStatus);

// Staff & Managers
router.get('/staff', listStaff);
router.post('/staff', createStaff);

// Tenants / Residents
router.get('/tenants', listTenants);
router.post('/tenants/onboard', onboardTenant);

// Complaints
router.get('/complaints', listComplaints);
router.patch('/complaints/:id/status', updateComplaintStatus);

// Gate Logs & Attendance
router.get('/properties/:propertyId/gate-logs', listGateLogs);
router.post('/gate-logs', addGateLog);

export default router;

