import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';
import { StaffService } from './staff.service';

export const getStaffDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StaffService.getDashboard(userId);
    return sendSuccess(res, 'Staff dashboard fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch staff dashboard', 500, error);
  }
};

export const getStock = async (req: AuthRequest, res: Response) => {
  try {
    const data = await StaffService.getStock();
    return sendSuccess(res, 'Stock items fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch stock items', 500, error);
  }
};

export const updateStock = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { currentQuantity } = req.body;
    const data = await StaffService.updateStock(id, Number(currentQuantity));
    return sendSuccess(res, 'Stock item updated successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update stock item', 500, error);
  }
};

export const getStaffTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StaffService.listTasks(userId);
    return sendSuccess(res, 'Staff tasks fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch staff tasks', 500, error);
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;
    const data = await StaffService.updateTaskStatus(id, status);
    return sendSuccess(res, 'Task status updated successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update task status', 500, error);
  }
};
