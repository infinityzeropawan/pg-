import { Router } from 'express';
import { authenticateJwt, authorizeRoles } from '../../middleware/auth.middleware';
import { requireFeature, requirePropertyQuota } from '../../middleware/feature.middleware';
import {
  getDashboardStats,
  listProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
  listRooms,
  getRoom,
  createRoom,
  deleteRoom,
  updateRoomMaintenance,
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
  getGateQr,
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
  listVisitors,
  checkoutVisitor,
  listLeaves,
  updateLeaveStatus,
  listAttendance,
  recordStudentAttendance,
  listInventory,
  createInventoryItem,
  updateInventoryItem,
  listStaffTasks,
  createStaffTask,
  updateStaffTaskStatus,
  listInvoices,
  recordInvoicePayment,
  listDocuments,
} from './admin.controller';

const router = Router();

// Protected Admin / Owner / Manager Endpoints
router.use(authenticateJwt, authorizeRoles('OWNER', 'MANAGER', 'SUPERADMIN'));

// Dashboard & Finance Summary
router.get('/dashboard', getDashboardStats);
router.get('/finance/summary', getFinanceSummary);

// Properties CRUD
// First property is always allowed; extra properties require the `multi_property` plan feature.
router.get('/properties', listProperties);
router.post('/properties', requirePropertyQuota(), createProperty);
router.get('/properties/:id', getPropertyDetail);
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);

// Rooms & Beds
router.get('/properties/:propertyId/rooms', listRooms);
router.get('/rooms/:id', getRoom);
router.post('/rooms', createRoom);
router.delete('/rooms/:id', deleteRoom);
router.patch('/rooms/:id/maintenance', updateRoomMaintenance);
router.patch('/beds/:bedId/status', updateBedStatus);

// Staff & Managers
router.get('/staff', listStaff);
router.post('/staff', createStaff);
router.get('/staff/attendance', listStaffAttendance);
router.post('/staff/attendance', recordStaffAttendance);

// Visitors
router.get('/visitors', listVisitors);
router.patch('/visitors/:id/checkout', checkoutVisitor);

// Leave Requests
router.get('/leaves', listLeaves);
router.patch('/leaves/:id/status', updateLeaveStatus);

// Student Attendance
router.get('/attendance', listAttendance);
router.post('/attendance', recordStudentAttendance);

// Inventory (stock items)
router.get('/inventory', listInventory);
router.post('/inventory', createInventoryItem);
router.patch('/inventory/:id', updateInventoryItem);

// Staff tasks (housekeeping / maintenance work orders)
router.get('/tasks', listStaffTasks);
router.post('/tasks', createStaffTask);
router.patch('/tasks/:id/status', updateStaffTaskStatus);

// Invoices & Payments
router.get('/invoices', requireFeature('rent_invoicing'), listInvoices);
router.post('/invoices/:id/pay', requireFeature('rent_invoicing'), recordInvoicePayment);

// Documents
router.get('/documents', listDocuments);

// Tenants / Residents
router.get('/tenants', listTenants);
router.post('/tenants/onboard', onboardTenant);

// Complaints
router.get('/complaints', requireFeature('basic_complaints'), listComplaints);
router.post('/complaints', requireFeature('basic_complaints'), createComplaint);
router.patch('/complaints/:id/status', requireFeature('basic_complaints'), updateComplaintStatus);

// Gate Logs & Attendance
router.get('/properties/:propertyId/gate-logs', listGateLogs);
router.get('/properties/:propertyId/gate-qr', getGateQr);
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
