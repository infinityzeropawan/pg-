import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';
import { StaffService, StaffAccessError } from './staff.service';

const fail = (res: Response, error: unknown, fallback: string) => {
  if (error instanceof StaffAccessError) return sendError(res, error.message, error.statusCode);
  const message = error instanceof Error ? error.message : fallback;
  return sendError(res, message || fallback, 500, error);
};

export const getStaffDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StaffService.getDashboard(userId);
    return sendSuccess(res, 'Staff dashboard fetched successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to fetch staff dashboard');
  }
};

export const getStock = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const propertyId = typeof req.query.propertyId === 'string' ? req.query.propertyId : undefined;
    const data = await StaffService.getStock(userId, propertyId);
    return sendSuccess(res, 'Stock items fetched successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to fetch stock items');
  }
};

export const updateStock = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const id = String(req.params.id);
    const { currentQuantity } = req.body;
    const data = await StaffService.updateStock(userId, id, Number(currentQuantity));
    return sendSuccess(res, 'Stock item updated successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to update stock item');
  }
};

export const getStaffTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StaffService.listTasks(userId);
    return sendSuccess(res, 'Staff tasks fetched successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to fetch staff tasks');
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const id = String(req.params.id);
    const { status } = req.body;
    const data = await StaffService.updateTaskStatus(userId, id, String(status || '').toUpperCase());
    return sendSuccess(res, 'Task status updated successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to update task status');
  }
};
