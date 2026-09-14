import { Router } from 'express';
import { authenticateJwt, authorizeRoles } from '../../middleware/auth.middleware';
import {
  getParentDashboard,
  getParentProfile,
  updateParentProfile,
  getParentGateLogs,
  getParentInvoices,
  payParentInvoice,
  getParentComplaints,
  getParentAlerts,
  getParentNotifications,
} from './parent.controller';

const router = Router();

// All parent routes require JWT authentication and PARENT or SUPERADMIN role
router.use(authenticateJwt, authorizeRoles('PARENT', 'SUPERADMIN'));

// ── Dashboard ─────────────────────────────────────────────────
router.get('/dashboard', getParentDashboard);

// ── Profile ───────────────────────────────────────────────────
router.get('/profile', getParentProfile);
router.put('/profile', updateParentProfile);

// ── Child's Gate Attendance / Presence ───────────────────────
router.get('/attendance', getParentGateLogs);
router.get('/gate-logs', getParentGateLogs);

// ── Child's Finance & Invoices ────────────────────────────────
router.get('/invoices', getParentInvoices);
router.post('/invoices/:id/pay', payParentInvoice);

// ── Child's Complaints ────────────────────────────────────────
router.get('/complaints', getParentComplaints);

// ── Safety Alerts (SOS, Late Entries, Dues) ───────────────────
router.get('/alerts', getParentAlerts);

// ── Notifications ─────────────────────────────────────────────
router.get('/notifications', getParentNotifications);

export default router;
