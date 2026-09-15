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
  createComplaint,
  listGateLogs,
  addGateLog,
  listNotices,
  createNotice,
  deleteNotice,
  getFoodMenu,
  updateFoodMenu,
  listMaintenance,
  createMaintenance,
  getFinanceSummary,
  listExpenses,
  createExpense,
  listEnquiries,
  createEnquiry,
  resolveEnquiry,
  listStaffAttendance,
  recordStaffAttendance,
} from './admin.controller';

const router = Router();

// Protected Admin / Owner / Manager Endpoints
router.use(authenticateJwt, authorizeRoles('OWNER', 'MANAGER', 'SUPERADMIN'));

// Dashboard & Finance Summary
router.get('/dashboard', getDashboardStats);
router.get('/finance/summary', getFinanceSummary);

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
router.get('/staff/attendance', listStaffAttendance);
router.post('/staff/attendance', recordStaffAttendance);

// Tenants / Residents
router.get('/tenants', listTenants);
router.post('/tenants/onboard', onboardTenant);

// Complaints
router.get('/complaints', listComplaints);
router.post('/complaints', createComplaint);
router.patch('/complaints/:id/status', updateComplaintStatus);

// Gate Logs & Attendance
router.get('/properties/:propertyId/gate-logs', listGateLogs);
router.post('/gate-logs', addGateLog);

// Notices & Announcements
router.get('/notices', listNotices);
router.post('/notices', createNotice);
router.delete('/notices/:id', deleteNotice);

// Food Menu
router.get('/food-menu', getFoodMenu);
router.put('/food-menu', updateFoodMenu);

// Maintenance & AMC Contracts
router.get('/maintenance', listMaintenance);
router.post('/maintenance', createMaintenance);

// Expenses
router.get('/expenses', listExpenses);
router.post('/expenses', createExpense);

// Enquiries
router.get('/enquiries', listEnquiries);
router.post('/enquiries', createEnquiry);
router.patch('/enquiries/:id/resolve', resolveEnquiry);

export default router;
