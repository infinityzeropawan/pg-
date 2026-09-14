import { Router } from 'express';
import { authenticateJwt, authorizeRoles } from '../../middleware/auth.middleware';
import {
  // Profile & Room
  getStudentProfile,
  updateStudentProfile,
  getStudentRoom,
  // Finance
  getStudentInvoices,
  getStudentRentHistory,
  payStudentInvoice,
  // Complaints
  getStudentComplaints,
  createStudentComplaint,
  // Mess
  getStudentMess,
  rechargeMessWallet,
  orderMeal,
  rateMeal,
  // Notices
  getStudentNotices,
  submitNoticePeriod,
  // Visitors
  getStudentVisitors,
  addStudentVisitor,
  checkOutVisitor,
  // Leaves
  getStudentLeaves,
  requestStudentLeave,
  cancelStudentLeave,
  // SOS
  triggerStudentSOS,
  resolveStudentSOS,
  getStudentSOSHistory,
  // Gate Attendance
  recordStudentGateAttendance,
  getStudentGateLogs,
  // Attendance
  getStudentAttendance,
  // Documents
  getStudentDocuments,
  // Notifications
  getStudentNotifications,
  markStudentNotificationRead,
  // History & Feedback
  getStudentHistory,
  submitStudentFeedback,
} from './student.controller';

const router = Router();

// All student routes require JWT authentication and STUDENT or SUPERADMIN role
router.use(authenticateJwt, authorizeRoles('STUDENT', 'SUPERADMIN'));

// ── Profile & Room ─────────────────────────────────────────────
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.get('/room', getStudentRoom);

// ── Finance: Invoices & Payments ──────────────────────────────
router.get('/invoices', getStudentInvoices);
router.get('/rent-history', getStudentRentHistory);
router.post('/invoices/:id/pay', payStudentInvoice);

// ── Complaints ────────────────────────────────────────────────
router.get('/complaints', getStudentComplaints);
router.post('/complaints', createStudentComplaint);

// ── Mess / Food ───────────────────────────────────────────────
router.get('/mess', getStudentMess);
router.get('/mess-menu', getStudentMess);
router.post('/mess/wallet/recharge', rechargeMessWallet);
router.post('/mess/order', orderMeal);
router.patch('/mess/orders/:id/rate', rateMeal);

// ── Notices / Broadcasts ──────────────────────────────────────
router.get('/notices', getStudentNotices);
router.post('/notice-period', submitNoticePeriod);

// ── Visitors ──────────────────────────────────────────────────
router.get('/visitors', getStudentVisitors);
router.post('/visitors', addStudentVisitor);
router.patch('/visitors/:id/checkout', checkOutVisitor);

// ── Leave Requests ────────────────────────────────────────────
router.get('/leaves', getStudentLeaves);
router.post('/leaves', requestStudentLeave);
router.patch('/leaves/:id/cancel', cancelStudentLeave);

// ── SOS / Safety ──────────────────────────────────────────────
router.post('/sos', triggerStudentSOS);
router.patch('/sos/:id/resolve', resolveStudentSOS);
router.get('/sos/history', getStudentSOSHistory);

// ── Gate Attendance ───────────────────────────────────────────
router.get('/gate-attendance', getStudentGateLogs);
router.post('/gate-attendance', recordStudentGateAttendance);

// ── Attendance Records ────────────────────────────────────────
router.get('/attendance', getStudentAttendance);

// ── Documents & Agreements ────────────────────────────────────
router.get('/documents', getStudentDocuments);

// ── Notifications ─────────────────────────────────────────────
router.get('/notifications', getStudentNotifications);
router.patch('/notifications/:id/read', markStudentNotificationRead);

// ── Activity History / Timeline ───────────────────────────────
router.get('/history', getStudentHistory);

// ── Feedback & Support ────────────────────────────────────────
router.post('/feedback', submitStudentFeedback);

export default router;
