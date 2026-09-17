import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { AdminService, AdminRequestError } from './admin.service';
import { sendSuccess, sendError } from '../../utils/response';
import { PropertyType, RoomType, BedStatus, ComplaintStatus, UserRole, ComplaintPriority } from '@prisma/client';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.role === 'SUPERADMIN' ? (req.query.ownerId as string) || req.user.userId : req.user?.ownerId || req.user?.userId;
    const propertyId = req.query.propertyId as string | undefined;

    if (!ownerId) return sendError(res, 'Owner ID not found', 400);

    const data = await AdminService.getDashboardStats(ownerId, propertyId);
    return sendSuccess(res, 'Dashboard statistics fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch dashboard stats', 500, error);
  }
};

// ==========================================
// PROPERTIES
// ==========================================
export const listProperties = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.role === 'SUPERADMIN' ? (req.query.ownerId as string) || req.user.userId : req.user?.ownerId || req.user?.userId;
    if (!ownerId) return sendError(res, 'Owner ID required', 400);

    const data = await AdminService.listProperties(ownerId);
    return sendSuccess(res, 'Properties fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to list properties', 500, error);
  }
};

export const getPropertyDetail = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const ownerId = req.user?.role === 'SUPERADMIN' ? (req.query.ownerId as string) || req.user.userId : req.user?.ownerId || req.user?.userId;
    if (!id || !ownerId) return sendError(res, 'Property ID and Owner ID required', 400);

    const data = await AdminService.getPropertyDetail(id, ownerId);
    if (!data) return sendError(res, 'Property not found', 404);

    return sendSuccess(res, 'Property details fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch property detail', 500, error);
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId;
    if (!ownerId) return sendError(res, 'Owner ID required', 400);

    const { name, type, address, city, state, pincode, contactPhone, contactEmail, amenities, rules, floorsCount, defaultDeposit, bedRent, generateRooms, singleRoomsCount, doubleRoomsCount, tripleRoomsCount } = req.body;

    if (!name || !address || !city) {
      return sendError(res, 'Name, address, and city are required', 400);
    }

    // Normalize UI-friendly type labels to the Prisma PropertyType enum
    const typeMap: Record<string, PropertyType> = {
      boys: PropertyType.BOYS_PG,
      boys_pg: PropertyType.BOYS_PG,
      girls: PropertyType.GIRLS_PG,
      girls_pg: PropertyType.GIRLS_PG,
      coed: PropertyType.COED_PG,
      coed_pg: PropertyType.COED_PG,
      hostel: PropertyType.HOSTEL,
      coliving: PropertyType.COLIVING,
    };
    const normalizedType = (type ? typeMap[String(type).toLowerCase()] : undefined) || PropertyType.BOYS_PG;

    const property = await AdminService.createProperty(ownerId, {
      name,
      type: normalizedType,
      address,
      city,
      state,
      pincode,
      contactPhone: contactPhone || '9999999999',
      contactEmail: contactEmail || req.user?.email || 'admin@smartpg.com',
      amenities,
      rules,
      floorsCount: Number(floorsCount) || 2,
      defaultDeposit: Number(defaultDeposit) || 0,
      bedRent: Number(bedRent) || 0,
      generateRooms: Boolean(generateRooms),
      singleRoomsCount: Number(singleRoomsCount) || 0,
      doubleRoomsCount: Number(doubleRoomsCount) || 0,
      tripleRoomsCount: Number(tripleRoomsCount) || 0,
    });

    return sendSuccess(res, 'Property created successfully', property, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create property', 500, error);
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const ownerId = req.user?.ownerId || req.user?.userId;
    if (!id || !ownerId) return sendError(res, 'Property ID required', 400);

    const updated = await AdminService.updateProperty(id, ownerId, req.body);
    return sendSuccess(res, 'Property updated successfully', updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update property', 500, error);
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const ownerId = req.user?.ownerId || req.user?.userId;
    if (!id || !ownerId) return sendError(res, 'Property ID required', 400);

    await AdminService.deleteProperty(id, ownerId);
    return sendSuccess(res, 'Property deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete property', 500, error);
  }
};

// ==========================================
// ROOMS & BEDS
// ==========================================
const fail = (res: Response, error: unknown, fallback: string) => {
  if (error instanceof AdminRequestError) return sendError(res, error.message, error.statusCode);
  const message = error instanceof Error ? error.message : fallback;
  return sendError(res, message || fallback, 500, error);
};

/** Builds the property-scoping actor from the verified JWT payload. */
const actorFrom = (req: AuthRequest) => ({
  userId: req.user?.userId || '',
  ownerId: req.user?.ownerId || undefined,
  role: req.user?.role || '',
});

export const listRooms = async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = String(req.params.propertyId);
    if (!propertyId) return sendError(res, 'Property ID required', 400);

    const data = await AdminService.listRooms(propertyId, actorFrom(req));
    return sendSuccess(res, 'Rooms fetched successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to list rooms');
  }
};

export const getRoom = async (req: AuthRequest, res: Response) => {
  try {
    const data = await AdminService.getRoom(String(req.params.id), actorFrom(req));
    return sendSuccess(res, 'Room fetched successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to fetch room');
  }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body || {};
    // `sharingType` / `baseRentMonthly` are still accepted so older callers keep working.
    const room = await AdminService.createRoom({
      propertyId: typeof body.propertyId === 'string' ? body.propertyId.trim() : '',
      roomNumber: typeof body.roomNumber === 'string' ? body.roomNumber.trim() : String(body.roomNumber ?? ''),
      floorNumber: Number(body.floorNumber ?? 1),
      bedCount: Number(body.bedCount ?? body.sharingType),
      monthlyRent: Number(body.monthlyRent ?? body.baseRentMonthly ?? body.rentPerBed),
    }, actorFrom(req));

    return sendSuccess(res, 'Room created successfully', room, 201);
  } catch (error) {
    return fail(res, error, 'Failed to create room');
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response) => {
  try {
    const data = await AdminService.deleteRoom(String(req.params.id), actorFrom(req));
    return sendSuccess(res, 'Room deleted successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to delete room');
  }
};

export const updateRoomMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const { isMaintenance } = req.body || {};
    if (typeof isMaintenance !== 'boolean') {
      return sendError(res, 'isMaintenance must be true or false', 400);
    }

    const data = await AdminService.setRoomMaintenance(String(req.params.id), isMaintenance, actorFrom(req));
    return sendSuccess(res, 'Room maintenance updated successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to update room maintenance');
  }
};

export const updateBedStatus = async (req: AuthRequest, res: Response) => {
  try {
    const bedId = String(req.params.bedId);
    const { status } = req.body || {};
    if (!bedId || !status) return sendError(res, 'Bed ID and status required', 400);

    const updated = await AdminService.updateBedStatus(bedId, status as BedStatus, actorFrom(req));
    return sendSuccess(res, 'Bed status updated successfully', updated);
  } catch (error) {
    return fail(res, error, 'Failed to update bed status');
  }
};

// ==========================================
// STAFF & MANAGERS
// ==========================================
export const listStaff = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId;
    if (!ownerId) return sendError(res, 'Owner ID required', 400);

    const data = await AdminService.listStaff(ownerId);
    return sendSuccess(res, 'Staff members fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to list staff', 500, error);
  }
};

export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId;
    if (!ownerId) return sendError(res, 'Owner ID required', 400);

    const { fullName, email, phone, role, propertyIds, password } = req.body;
    if (!fullName || !email || !phone) {
      return sendError(res, 'Name, email, and phone are required', 400);
    }

    const staff = await AdminService.createStaff(ownerId, {
      fullName,
      email,
      phone,
      role: (role as UserRole) || UserRole.MANAGER,
      propertyId: Array.isArray(propertyIds) ? propertyIds[0] : (propertyIds || req.body.propertyId || ''),
    });

    return sendSuccess(res, 'Staff member created successfully', staff, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create staff member', 500, error);
  }
};

// ==========================================
// TENANTS / RESIDENTS
// ==========================================
export const listTenants = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId;
    const propertyId = req.query.propertyId as string | undefined;
    if (!ownerId) return sendError(res, 'Owner ID required', 400);

    const data = await AdminService.listTenants(ownerId, propertyId);
    return sendSuccess(res, 'Tenants fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to list tenants', 500, error);
  }
};

export const onboardTenant = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId;
    if (!ownerId) return sendError(res, 'Owner ID required', 400);

    const {
      propertyId,
      bedId,
      fullName,
      email,
      phone,
      monthlyRent,
      securityDeposit,
      parentName,
      parentPhone,
      permanentAddress,
      idProofNumber,
      checkInDate,
    } = req.body;

    if (!propertyId || !bedId || !fullName || !phone) {
      return sendError(res, 'Property, bed, name, and phone are required', 400);
    }

    const stay = await AdminService.onboardTenant(ownerId, {
      fullName,
      email: email || `${phone}@smartpg.com`,
      phone,
      propertyId,
      bedId,
      monthlyRent: Number(monthlyRent) || 8500,
      securityDeposit: Number(securityDeposit) || 10000,
      startDate: checkInDate || new Date().toISOString(),
      emergencyContactName: parentName,
      emergencyContactPhone: parentPhone,
      permanentAddress,
      idProofNumber,
    });

    return sendSuccess(res, 'Tenant onboarded successfully', stay, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to onboard tenant', 500, error);
  }
};

// ==========================================
// COMPLAINTS
// ==========================================
export const listComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId;
    const propertyId = req.query.propertyId as string | undefined;
    if (!ownerId) return sendError(res, 'Owner ID required', 400);

    const data = await AdminService.listComplaints(ownerId, propertyId);
    return sendSuccess(res, 'Complaints fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to list complaints', 500, error);
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, resolutionNotes } = req.body;
    if (!id || !status) return sendError(res, 'Complaint ID and status required', 400);

    const updated = await AdminService.updateComplaintStatus(id, status as ComplaintStatus);
    return sendSuccess(res, 'Complaint status updated successfully', updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update complaint status', 500, error);
  }
};

// ==========================================
// GATE LOGS
// ==========================================
export const listGateLogs = async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = String(req.params.propertyId);
    if (!propertyId) return sendError(res, 'Property ID required', 400);

    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const data = await AdminService.listGateLogs(propertyId, ownerId, req.user?.role === 'MANAGER' ? req.user.userId : undefined);
    return sendSuccess(res, 'Gate logs fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to list gate logs', 500, error);
  }
};

export const addGateLog = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, studentId, studentName, roomNumber, type, reason, destination, expectedReturnTime, isLate } = req.body;
    if (!propertyId || !studentId || !type) {
      return sendError(res, 'Property ID, student ID, and type are required', 400);
    }

    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const log = await AdminService.addGateLog(ownerId, req.user!.userId, {
      propertyId, studentId, type,
      reason, destination, expectedReturnTime, isLate,
    }, req.user?.role === 'MANAGER' ? req.user.userId : undefined);

    return sendSuccess(res, 'Gate log recorded successfully', log, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record gate log', 500, error);
  }
};

/**
 * Signed token + real property details for the printable gate QR poster.
 * Available to the OWNER and to the MANAGER assigned to the property.
 */
export const getGateQr = async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = String(req.params.propertyId);
    if (!propertyId) return sendError(res, 'Property ID required', 400);

    const data = await AdminService.getPropertyGateQr(propertyId, actorFrom(req));
    return sendSuccess(res, 'Gate QR fetched successfully', data);
  } catch (error) {
    return fail(res, error, 'Failed to fetch gate QR');
  }
};

// ==========================================
// NOTICES
// ==========================================
export const listNotices = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const data = await AdminService.listNotices(ownerId);
    return sendSuccess(res, 'Notices fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch notices', 500, error);
  }
};

export const createNotice = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const { title, content, category, target, isPinned } = req.body;
    if (!title || !content) return sendError(res, 'Title and content required', 400);

    const notice = await AdminService.createNotice(ownerId, {
      title,
      message: content,
      propertyId: req.body.propertyId,
    });
    return sendSuccess(res, 'Notice created successfully', notice, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create notice', 500, error);
  }
};

export const deleteNotice = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const id = String(req.params.id);
    await AdminService.deleteNotice(id);
    return sendSuccess(res, 'Notice deleted successfully', null);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete notice', 500, error);
  }
};

// ==========================================
// FOOD MENU
// ==========================================
export const getFoodMenu = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const menu = await AdminService.getFoodMenu(ownerId);
    return sendSuccess(res, 'Food menu fetched successfully', menu);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch food menu', 500, error);
  }
};

export const updateFoodMenu = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const { weekMenuJson } = req.body;
    if (!weekMenuJson) return sendError(res, 'Week menu JSON required', 400);

    const menu = await AdminService.updateFoodMenu(ownerId, typeof weekMenuJson === 'string' ? weekMenuJson : JSON.stringify(weekMenuJson));
    return sendSuccess(res, 'Food menu updated successfully', menu);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update food menu', 500, error);
  }
};

// ==========================================
// MAINTENANCE
// ==========================================
export const listMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const data = await AdminService.listMaintenance(ownerId);
    return sendSuccess(res, 'Maintenance contracts fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch maintenance contracts', 500, error);
  }
};

export const createMaintenance = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const { vendorName, serviceType, startDate, endDate, cost, status } = req.body;
    if (!vendorName || !serviceType || !startDate || !endDate) {
      return sendError(res, 'Vendor name, service type, start and end date required', 400);
    }

    const item = await AdminService.createMaintenance(ownerId, {
      propertyId: req.body.propertyId || '',
      title: vendorName || serviceType,
      amount: Number(cost || 0),
    });
    return sendSuccess(res, 'Maintenance contract created successfully', item, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create maintenance contract', 500, error);
  }
};

// ==========================================
// FINANCE SUMMARY
// ==========================================
export const getFinanceSummary = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const data = await AdminService.getFinanceSummary(ownerId);
    return sendSuccess(res, 'Finance summary fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch finance summary', 500, error);
  }
};

// ==========================================
// CREATE COMPLAINT
// ==========================================
export const createComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '';
    const { propertyId, category, title, description, priority } = req.body;
    if (!propertyId || !category || !title || !description) {
      return sendError(res, 'Property ID, category, title, and description required', 400);
    }

    const complaint = await AdminService.createComplaint(userId, {
      propertyId,
      title,
      description,
      category,
      priority: priority as ComplaintPriority,
    });
    return sendSuccess(res, 'Complaint submitted successfully', complaint, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create complaint', 500, error);
  }
};

// ==========================================
// EXPENSES
// ==========================================
export const listExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    const data = await AdminService.listExpenses(ownerId, propertyId);
    return sendSuccess(res, 'Expenses fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch expenses', 500, error);
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const { propertyId, category, title, amount, expenseDate } = req.body;
    if (!propertyId || !title || !amount) {
      return sendError(res, 'Property ID, title, and amount required', 400);
    }
    const item = await AdminService.createExpense(ownerId, {
      propertyId,
      category,
      title,
      amount: Number(amount),
      expenseDate: expenseDate ? new Date(expenseDate) : undefined,
    });
    return sendSuccess(res, 'Expense recorded successfully', item, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record expense', 500, error);
  }
};

// ==========================================
// ENQUIRIES
// ==========================================
export const listEnquiries = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    const data = await AdminService.listEnquiries(ownerId, propertyId);
    return sendSuccess(res, 'Enquiries fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch enquiries', 500, error);
  }
};

export const createEnquiry = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, name, phone, email, message } = req.body;
    if (!propertyId || !name || !phone) {
      return sendError(res, 'Property ID, name, and phone required', 400);
    }
    const item = await AdminService.createEnquiry({ propertyId, name, phone, email, message });
    return sendSuccess(res, 'Enquiry submitted successfully', item, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to submit enquiry', 500, error);
  }
};

export const resolveEnquiry = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const item = await AdminService.resolveEnquiry(id);
    return sendSuccess(res, 'Enquiry resolved successfully', item);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to resolve enquiry', 500, error);
  }
};

// ==========================================
// STAFF ATTENDANCE
// ==========================================
export const listStaffAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    // The owner/manager UI has always sent `?date=`, but this handler used to drop
    // it, so the date picker silently showed the same rows for every day.
    const date = req.query.date as string | undefined;
    const data = await AdminService.listStaffAttendance(ownerId, propertyId, date);
    return sendSuccess(res, 'Staff attendance fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch staff attendance', 500, error);
  }
};

export const recordStaffAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, userId, date, status, remarks } = req.body;
    if (!propertyId || !userId || !date || !status) {
      return sendError(res, 'Property ID, User ID, Date, and Status required', 400);
    }
    const item = await AdminService.recordStaffAttendance({ propertyId, userId, date: new Date(date), status, remarks });
    return sendSuccess(res, 'Staff attendance recorded successfully', item);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record staff attendance', 500, error);
  }
};

// ==========================================
// VISITORS
// ==========================================
export const listVisitors = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    const data = await AdminService.listVisitors(ownerId, propertyId);
    return sendSuccess(res, 'Visitors fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch visitors', 500, error);
  }
};

export const checkoutVisitor = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = await AdminService.checkoutVisitor(id);
    return sendSuccess(res, 'Visitor checked out successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to check out visitor', 500, error);
  }
};

// ==========================================
// LEAVE REQUESTS
// ==========================================
export const listLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    const status = req.query.status as string | undefined;
    const data = await AdminService.listLeaves(ownerId, propertyId, status);
    return sendSuccess(res, 'Leave requests fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch leave requests', 500, error);
  }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;
    const approverId = req.user?.userId || '';
    if (!status) return sendError(res, 'Status is required', 400);
    const data = await AdminService.updateLeaveStatus(id, status, approverId);
    return sendSuccess(res, 'Leave request updated successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update leave request', 500, error);
  }
};

// ==========================================
// STUDENT ATTENDANCE
// ==========================================
export const listAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    const date = req.query.date as string | undefined;
    const data = await AdminService.listAttendance(ownerId, propertyId, date);
    return sendSuccess(res, 'Attendance fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch attendance', 500, error);
  }
};

export const recordStudentAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, userId, date, status, remarks } = req.body;
    if (!propertyId || !userId || !date || !status) {
      return sendError(res, 'Property ID, User ID, Date, and Status required', 400);
    }
    const data = await AdminService.recordStudentAttendance({ propertyId, userId, date: new Date(date), status, remarks });
    return sendSuccess(res, 'Attendance recorded successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record attendance', 500, error);
  }
};

// ==========================================
// INVENTORY
// ==========================================
export const listInventory = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    const data = await AdminService.listInventory(ownerId, propertyId);
    return sendSuccess(res, 'Inventory fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch inventory', 500, error);
  }
};

export const createInventoryItem = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, itemName, category, currentQuantity, unit, minThreshold } = req.body;
    if (!propertyId || !itemName || !category) {
      return sendError(res, 'Property ID, item name and category are required', 400);
    }
    const data = await AdminService.createInventoryItem({ propertyId, itemName, category, currentQuantity, unit, minThreshold });
    return sendSuccess(res, 'Inventory item created successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create inventory item', 500, error);
  }
};

export const updateInventoryItem = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const data = await AdminService.updateInventoryItem(id, req.body);
    return sendSuccess(res, 'Inventory item updated successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update inventory item', 500, error);
  }
};

// ==========================================
// STAFF TASKS
// ==========================================
export const listStaffTasks = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    const status = req.query.status as string | undefined;
    const data = await AdminService.listStaffTasks(ownerId, propertyId, status);
    return sendSuccess(res, 'Tasks fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch tasks', 500, error);
  }
};

export const createStaffTask = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId, assignedTo, title, description, priority, dueDate } = req.body;
    if (!propertyId || !assignedTo || !title) {
      return sendError(res, 'Property ID, assignee and title are required', 400);
    }
    const data = await AdminService.createStaffTask({ propertyId, assignedTo, title, description: description || '', priority, dueDate });
    return sendSuccess(res, 'Task created successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create task', 500, error);
  }
};

export const updateStaffTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;
    if (!status) return sendError(res, 'Status is required', 400);
    const data = await AdminService.updateStaffTaskStatus(id, status);
    return sendSuccess(res, 'Task updated successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update task', 500, error);
  }
};

// ==========================================
// INVOICES & PAYMENTS
// ==========================================
export const listInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    const status = req.query.status as string | undefined;
    const data = await AdminService.listInvoices(ownerId, propertyId, status);
    return sendSuccess(res, 'Invoices fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch invoices', 500, error);
  }
};

export const recordInvoicePayment = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const invoiceId = String(req.params.id);
    const { amount, method } = req.body;
    if (amount === undefined || amount === null) return sendError(res, 'Payment amount is required', 400);
    const data = await AdminService.recordInvoicePayment({ ownerId, invoiceId, amount: Number(amount), method });
    return sendSuccess(res, 'Payment recorded successfully', data, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record payment', 500, error);
  }
};

// ==========================================
// DOCUMENTS
// ==========================================
export const listDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.ownerId || req.user?.userId || '';
    const propertyId = req.query.propertyId as string | undefined;
    const data = await AdminService.listDocuments(ownerId, propertyId);
    return sendSuccess(res, 'Documents fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch documents', 500, error);
  }
};

