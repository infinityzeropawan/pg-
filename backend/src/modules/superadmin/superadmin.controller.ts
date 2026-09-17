import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { SuperadminService } from './superadmin.service';
import { FeatureService } from '../features/features.service';
import { sendSuccess, sendError } from '../../utils/response';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await SuperadminService.getDashboardStats();
    return sendSuccess(res, 'Dashboard stats fetched successfully', stats);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch dashboard stats', 500, error);
  }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const analytics = await SuperadminService.getAnalyticsData();
    return sendSuccess(res, 'Analytics fetched successfully', analytics);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch analytics', 500, error);
  }
};

export const listOwnerRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await SuperadminService.listOwnerRequests();
    return sendSuccess(res, 'Owner requests fetched successfully', requests);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch owner requests', 500, error);
  }
};

export const createOwnerRequest = async (req: AuthRequest, res: Response) => {
  try {
    const newRequest = await SuperadminService.createOwnerRequest(req.body);
    return sendSuccess(res, 'Owner request submitted successfully', newRequest, 201);
  } catch (error: any) {
    return sendError(res, 'Failed to submit owner request', 400, error);
  }
};

export const updateOwnerRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, reason } = req.body;
    const actorId = req.user?.userId || '';

    if (!['APPROVED', 'REJECTED', 'UNDER_REVIEW'].includes(status)) {
      return sendError(res, 'Invalid owner request status', 400);
    }

    const updated = await SuperadminService.updateOwnerRequestStatus(id, status, actorId, reason);
    return sendSuccess(res, `Owner request ${status.toLowerCase()} successfully`, updated);
  } catch (error: any) {
    return sendError(res, 'Failed to update owner request status', 400, error);
  }
};

export const listOwners = async (req: AuthRequest, res: Response) => {
  try {
    const owners = await SuperadminService.listOwners();
    return sendSuccess(res, 'Owners fetched successfully', owners);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch owners', 500, error);
  }
};

export const createOwner = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.userId || '';
    const newOwner = await SuperadminService.createOwner(adminId, req.body);
    return sendSuccess(res, 'Owner account created successfully', newOwner, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create owner', 400, error);
  }
};

export const toggleOwnerSuspension = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { isSuspended } = req.body;
    const adminId = req.user?.userId || '';

    const updated = await SuperadminService.updateOwnerStatus(id, isSuspended, adminId);
    return sendSuccess(res, `Owner account ${isSuspended ? 'suspended' : 'activated'}`, updated);
  } catch (error: any) {
    return sendError(res, 'Failed to update owner status', 400, error);
  }
};

export const listPlans = async (req: AuthRequest, res: Response) => {
  try {
    const plans = await SuperadminService.listPlans();
    return sendSuccess(res, 'Plans fetched successfully', plans);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch plans', 500, error);
  }
};

export const createPlan = async (req: AuthRequest, res: Response) => {
  try {
    const plan = await SuperadminService.createPlan(req.body, req.user?.userId);
    return sendSuccess(res, 'Plan created successfully', plan, 201);
  } catch (error: any) {
    return sendError(res, 'Failed to create plan', 400, error);
  }
};

export const updatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const adminId = req.user?.userId || '';

    const updated = await SuperadminService.updatePlan(id, req.body, adminId);
    return sendSuccess(res, 'Plan updated successfully', updated);
  } catch (error: any) {
    return sendError(res, 'Failed to update plan', 400, error);
  }
};

export const listAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await SuperadminService.listAuditLogs();
    return sendSuccess(res, 'Audit logs fetched successfully', logs);
  } catch (error: any) {
    return sendError(res, 'Failed to fetch audit logs', 500, error);
  }
};

export const getOwnerDetail = async (req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Owner details fetched successfully', await SuperadminService.getOwnerDetail(req.params.id as string)); }
  catch (error: any) { return sendError(res, error.message || 'Failed to fetch owner details', 400, error); }
};

export const resetOwnerPassword = async (req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Owner password reset successfully', await SuperadminService.resetOwnerPassword(req.params.id as string, req.body.newPassword, req.user?.userId || '')); }
  catch (error: any) { return sendError(res, error.message || 'Failed to reset owner password', 400, error); }
};

export const getSettings = async (_req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Platform settings fetched successfully', await SuperadminService.getSettings()); }
  catch (error: any) { return sendError(res, 'Failed to fetch platform settings', 500, error); }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Platform settings updated successfully', await SuperadminService.updateSettings(req.body, req.user?.userId || '')); }
  catch (error: any) { return sendError(res, error.message || 'Failed to update platform settings', 400, error); }
};

export const listFeatureFlags = async (_req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Feature flags fetched successfully', await SuperadminService.listFeatureFlags()); }
  catch (error: any) { return sendError(res, 'Failed to fetch feature flags', 500, error); }
};

export const updateFeatureFlag = async (req: AuthRequest, res: Response) => {
  try {
    const { key, ownerId, isEnabled, description } = req.body;
    if (!key || !ownerId || typeof isEnabled !== 'boolean') return sendError(res, 'key, ownerId, and isEnabled are required', 400);
    return sendSuccess(res, 'Feature flag updated successfully', await SuperadminService.toggleFeatureFlag(key, ownerId, isEnabled, req.user?.userId || '', description));
  } catch (error: any) { return sendError(res, error.message || 'Failed to update feature flag', 400, error); }
};

export const listFeatureCatalog = async (_req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Feature catalog fetched successfully', await FeatureService.listCatalog()); }
  catch (error: any) { return sendError(res, 'Failed to fetch feature catalog', 500, error); }
};

export const getFeatureMatrix = async (_req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Feature matrix fetched successfully', await FeatureService.getMatrix()); }
  catch (error: any) { return sendError(res, 'Failed to fetch feature matrix', 500, error); }
};

export const upsertFeature = async (req: AuthRequest, res: Response) => {
  try {
    const { key, name, description, category, isCore, defaultEnabled, sortOrder, isActive } = req.body;
    if (!key) return sendError(res, 'key is required', 400);
    const feature = await FeatureService.upsertFeature({ key, name, description, category, isCore, defaultEnabled, sortOrder, isActive });
    return sendSuccess(res, 'Feature saved successfully', feature);
  } catch (error: any) { return sendError(res, error.message || 'Failed to save feature', 400, error); }
};

export const updatePlanFeatures = async (req: AuthRequest, res: Response) => {
  try {
    const planId = String(req.params.id);
    const items = Array.isArray(req.body?.features) ? req.body.features : null;
    if (!items) return sendError(res, 'features array is required', 400);

    const invalid = items.filter((item: any) => !item?.featureKey || typeof item.isEnabled !== 'boolean');
    if (invalid.length) return sendError(res, 'Each feature needs featureKey and boolean isEnabled', 400);

    const saved = await SuperadminService.setPlanFeatureEntitlements(planId, items, req.user?.userId || '');
    return sendSuccess(res, 'Plan features updated successfully', saved);
  } catch (error: any) { return sendError(res, error.message || 'Failed to update plan features', 400, error); }
};

export const listTickets = async (_req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Support tickets fetched successfully', await SuperadminService.listTickets()); }
  catch (error: any) { return sendError(res, 'Failed to fetch support tickets', 500, error); }
};

export const createTicket = async (req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Support ticket created successfully', await SuperadminService.createTicket(req.body, req.user?.userId || ''), 201); }
  catch (error: any) { return sendError(res, error.message || 'Failed to create support ticket', 400, error); }
};

export const updateTicketStatus = async (req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Support ticket updated successfully', await SuperadminService.updateTicketStatus(req.params.id as string, req.body.status, req.user?.userId || '')); }
  catch (error: any) { return sendError(res, error.message || 'Failed to update support ticket', 400, error); }
};

export const createBroadcast = async (req: AuthRequest, res: Response) => {
  try { return sendSuccess(res, 'Broadcast sent successfully', await SuperadminService.createBroadcast(req.body.message, req.user?.userId || ''), 201); }
  catch (error: any) { return sendError(res, error.message || 'Failed to send broadcast', 400, error); }
};

export const addOwnerNote = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { note } = req.body;
    const adminId = req.user?.userId || '';
    const audit = await SuperadminService.addOwnerNote(id, note, adminId);
    return sendSuccess(res, 'Owner note saved successfully', audit, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to add owner note', 400, error);
  }
};
