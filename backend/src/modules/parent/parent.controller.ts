import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';
import { ParentService } from './parent.service';

// ============================================================
// DASHBOARD
// ============================================================

export const getParentDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await ParentService.getDashboard(userId);
    return sendSuccess(res, 'Parent dashboard fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch parent dashboard', 500, error);
  }
};

// ============================================================
// PROFILE
// ============================================================

export const getParentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await ParentService.getProfile(userId);
    return sendSuccess(res, 'Parent profile fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch parent profile', 500, error);
  }
};

export const updateParentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { relation, address } = req.body;
    const data = await ParentService.updateProfile(userId, { relation, address });
    return sendSuccess(res, 'Parent profile updated successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update parent profile', 500, error);
  }
};

// ============================================================
// GATE LOGS (Child's Movement)
// ============================================================

export const getParentGateLogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await ParentService.getGateLogs(userId);
    return sendSuccess(res, 'Child gate logs fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch gate logs', 500, error);
  }
};

// ============================================================
// FINANCE — CHILD'S INVOICES
// ============================================================

export const getParentInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await ParentService.getInvoices(userId);
    return sendSuccess(res, 'Child invoices fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch invoices', 500, error);
  }
};

export const payParentInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const invoiceId = String(req.params.id);
    const { paymentMethod } = req.body;
    if (!invoiceId) return sendError(res, 'Invoice ID is required', 400);
    const data = await ParentService.payInvoiceForChild(userId, invoiceId, paymentMethod || 'UPI');
    return sendSuccess(res, 'Invoice paid successfully on behalf of child', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to pay invoice', error.message?.includes('Forbidden') ? 403 : 500, error);
  }
};

// ============================================================
// COMPLAINTS — CHILD'S COMPLAINTS
// ============================================================

export const getParentComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await ParentService.getComplaints(userId);
    return sendSuccess(res, 'Child complaints fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch complaints', 500, error);
  }
};

// ============================================================
// ALERTS — SAFETY & NOTIFICATIONS
// ============================================================

export const getParentAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await ParentService.getAlerts(userId);
    return sendSuccess(res, 'Safety alerts fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch alerts', 500, error);
  }
};

// ============================================================
// NOTIFICATIONS
// ============================================================

export const getParentNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await ParentService.getNotifications(userId);
    return sendSuccess(res, 'Notifications fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch notifications', 500, error);
  }
};
