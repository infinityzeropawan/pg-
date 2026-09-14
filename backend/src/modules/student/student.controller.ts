import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';
import { StudentService } from './student.service';

// ============================================================
// PROFILE & ROOM
// ============================================================

export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getProfile(userId);
    return sendSuccess(res, 'Student profile fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch student profile', 500, error);
  }
};

export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { emergencyContactName, emergencyContactPhone, permanentAddress, collegeOrCompany, idProofType, idProofNumber } = req.body;
    const data = await StudentService.updateProfile(userId, { emergencyContactName, emergencyContactPhone, permanentAddress, collegeOrCompany, idProofType, idProofNumber });
    return sendSuccess(res, 'Profile updated successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update profile', 500, error);
  }
};

export const getStudentRoom = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getRoomDetails(userId);
    if (!data) return sendError(res, 'No active room allocation found', 404);
    return sendSuccess(res, 'Room details fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch room details', 500, error);
  }
};

// ============================================================
// FINANCE — INVOICES & PAYMENTS
// ============================================================

export const getStudentInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getInvoices(userId);
    return sendSuccess(res, 'Invoices fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch invoices', 500, error);
  }
};

export const getStudentRentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getRentHistory(userId);
    return sendSuccess(res, 'Rent history fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch rent history', 500, error);
  }
};

export const payStudentInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const invoiceId = String(req.params.id);
    const { paymentMethod } = req.body;
    if (!invoiceId) return sendError(res, 'Invoice ID is required', 400);
    const data = await StudentService.payInvoice(userId, invoiceId, paymentMethod || 'UPI');
    return sendSuccess(res, 'Invoice paid successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to pay invoice', error.message?.includes('Forbidden') ? 403 : 500, error);
  }
};

// ============================================================
// COMPLAINTS
// ============================================================

export const getStudentComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getComplaints(userId);
    return sendSuccess(res, 'Complaints fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch complaints', 500, error);
  }
};

export const createStudentComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { category, title, description, priority } = req.body;
    if (!category) return sendError(res, 'Category is required', 400);
    if (!title) return sendError(res, 'Title is required', 400);
    if (!description) return sendError(res, 'Description is required', 400);
    const data = await StudentService.createComplaint(userId, { category, title, description, priority });
    return sendSuccess(res, 'Complaint submitted successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit complaint', 500, error);
  }
};

// ============================================================
// MESS & FOOD
// ============================================================

export const getStudentMess = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getMess(userId);
    return sendSuccess(res, 'Mess data fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch mess data', 500, error);
  }
};

export const rechargeMessWallet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { amount } = req.body;
    if (!amount || isNaN(Number(amount))) return sendError(res, 'Valid recharge amount is required', 400);
    const data = await StudentService.rechargeMessWallet(userId, Number(amount));
    return sendSuccess(res, 'Mess wallet recharged successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to recharge mess wallet', 500, error);
  }
};

export const orderMeal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { mealType, propertyId } = req.body;
    if (!mealType) return sendError(res, 'mealType is required', 400);
    const data = await StudentService.orderMeal(userId, mealType, propertyId);
    return sendSuccess(res, 'Meal ordered successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to order meal', 500, error);
  }
};

export const rateMeal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const orderId = String(req.params.id);
    const { rating, feedback } = req.body;
    if (!rating || isNaN(Number(rating))) return sendError(res, 'Rating (1–5) is required', 400);
    const data = await StudentService.rateMeal(userId, orderId, Number(rating), feedback);
    return sendSuccess(res, 'Meal rating submitted', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to rate meal', 500, error);
  }
};

// ============================================================
// NOTICES
// ============================================================

export const getStudentNotices = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getNotices(userId);
    return sendSuccess(res, 'Notices fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch notices', 500, error);
  }
};

export const submitNoticePeriod = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { moveOutDate, reason } = req.body;
    if (!moveOutDate) return sendError(res, 'Move-out date is required', 400);
    if (!reason) return sendError(res, 'Reason is required', 400);
    const data = await StudentService.submitNoticePeriod(userId, { moveOutDate, reason });
    return sendSuccess(res, 'Notice period submitted successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit notice period', 500, error);
  }
};

// ============================================================
// VISITORS
// ============================================================

export const getStudentVisitors = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getVisitors(userId);
    return sendSuccess(res, 'Visitor logs fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch visitor logs', 500, error);
  }
};

export const addStudentVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { visitorName, visitorPhone, purpose } = req.body;
    if (!visitorName) return sendError(res, 'Visitor name is required', 400);
    if (!visitorPhone) return sendError(res, 'Visitor phone is required', 400);
    if (!purpose) return sendError(res, 'Visit purpose is required', 400);
    const data = await StudentService.addVisitor(userId, { visitorName, visitorPhone, purpose });
    return sendSuccess(res, 'Visitor log added successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to add visitor', 500, error);
  }
};

export const checkOutVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const visitorLogId = String(req.params.id);
    const data = await StudentService.checkOutVisitor(userId, visitorLogId);
    return sendSuccess(res, 'Visitor checked out', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to check out visitor', 500, error);
  }
};

// ============================================================
// LEAVES
// ============================================================

export const getStudentLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getLeaves(userId);
    return sendSuccess(res, 'Leave requests fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch leave requests', 500, error);
  }
};

export const requestStudentLeave = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { startDate, endDate, reason } = req.body;
    if (!startDate) return sendError(res, 'Start date is required', 400);
    if (!endDate) return sendError(res, 'End date is required', 400);
    if (!reason) return sendError(res, 'Reason is required', 400);
    const data = await StudentService.requestLeave(userId, { startDate, endDate, reason });
    return sendSuccess(res, 'Leave request submitted successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit leave request', 500, error);
  }
};

export const cancelStudentLeave = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const leaveId = String(req.params.id);
    const data = await StudentService.cancelLeave(userId, leaveId);
    return sendSuccess(res, 'Leave request cancelled', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to cancel leave request', 500, error);
  }
};

// ============================================================
// SOS
// ============================================================

export const triggerStudentSOS = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { latitude, longitude } = req.body || {};
    const data = await StudentService.triggerSOS(userId, { latitude: Number(latitude) || undefined, longitude: Number(longitude) || undefined });
    return sendSuccess(res, 'Emergency SOS triggered successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to trigger SOS', 500, error);
  }
};

export const resolveStudentSOS = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const sosId = String(req.params.id);
    const data = await StudentService.resolveSOS(userId, sosId);
    return sendSuccess(res, 'SOS resolved', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to resolve SOS', 500, error);
  }
};

export const getStudentSOSHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getSOSHistory(userId);
    return sendSuccess(res, 'SOS history fetched', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch SOS history', 500, error);
  }
};

// ============================================================
// GATE ATTENDANCE
// ============================================================

export const recordStudentGateAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { type, reason, destination, expectedReturnTime } = req.body;
    if (!type) return sendError(res, 'Gate movement type (ENTRY/EXIT) is required', 400);
    const data = await StudentService.recordGateAttendance(userId, { type, reason, destination, expectedReturnTime });
    return sendSuccess(res, 'Gate attendance recorded successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record gate attendance', 500, error);
  }
};

export const getStudentGateLogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getGateLogs(userId);
    return sendSuccess(res, 'Gate logs fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch gate logs', 500, error);
  }
};

// ============================================================
// ATTENDANCE
// ============================================================

export const getStudentAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { month } = req.query;
    const data = await StudentService.getAttendance(userId, month as string | undefined);
    return sendSuccess(res, 'Attendance fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch attendance', 500, error);
  }
};

// ============================================================
// DOCUMENTS
// ============================================================

export const getStudentDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getDocuments(userId);
    return sendSuccess(res, 'Documents fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch documents', 500, error);
  }
};

// ============================================================
// NOTIFICATIONS
// ============================================================

export const getStudentNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getNotifications(userId);
    return sendSuccess(res, 'Notifications fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch notifications', 500, error);
  }
};

export const markStudentNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const notifId = String(req.params.id);
    const data = await StudentService.markNotificationRead(userId, notifId);
    return sendSuccess(res, 'Notification marked as read', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to mark notification', 500, error);
  }
};

// ============================================================
// HISTORY
// ============================================================

export const getStudentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const data = await StudentService.getHistory(userId);
    return sendSuccess(res, 'Activity history fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch history', 500, error);
  }
};

// ============================================================
// FEEDBACK
// ============================================================

export const submitStudentFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { title, description, priority } = req.body;
    if (!title) return sendError(res, 'Title is required', 400);
    if (!description) return sendError(res, 'Description is required', 400);
    const data = await StudentService.submitFeedback(userId, { title, description, priority });
    return sendSuccess(res, 'Feedback submitted successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit feedback', 500, error);
  }
};
