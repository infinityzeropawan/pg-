import { Router } from 'express';
import { authenticateJwt, authorizeRoles } from '../../middleware/auth.middleware';
import {
  getDashboardStats,
  getAnalytics,
  listOwnerRequests,
  createOwnerRequest,
  updateOwnerRequestStatus,
  listOwners,
  createOwner,
  toggleOwnerSuspension,
  listPlans,
  createPlan,
  updatePlan,
  listAuditLogs,
  getOwnerDetail,
  resetOwnerPassword,
  addOwnerNote,
  getSettings,
  updateSettings,
  listFeatureFlags,
  updateFeatureFlag,
  listTickets,
  createTicket,
  updateTicketStatus,
  createBroadcast,
} from './superadmin.controller';

const router = Router();

// Public onboarding lead creation
router.post('/owner-requests/public', createOwnerRequest);

// Protected SuperAdmin Endpoints
router.use(authenticateJwt, authorizeRoles('SUPERADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

router.get('/owner-requests', listOwnerRequests);
router.patch('/owner-requests/:id/status', updateOwnerRequestStatus);

router.get('/owners', listOwners);
router.post('/owners', createOwner);
router.get('/owners/:id', getOwnerDetail);
router.patch('/owners/:id/status', toggleOwnerSuspension);
router.post('/owners/:id/reset-password', resetOwnerPassword);
router.post('/owners/:id/notes', addOwnerNote);

router.get('/plans', listPlans);
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);

router.get('/audit-logs', listAuditLogs);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

router.get('/feature-flags', listFeatureFlags);
router.put('/feature-flags', updateFeatureFlag);

router.get('/tickets', listTickets);
router.post('/tickets', createTicket);
router.patch('/tickets/:id/status', updateTicketStatus);

router.post('/broadcasts', createBroadcast);

export default router;
