import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { AdminService } from './admin.service';
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
export const listRooms = async (req: AuthRequest, res: Response) => {
  try {
    const propertyId = String(req.params.propertyId);
    if (!propertyId) return sendError(res, 'Property ID required', 400);

    const data = await AdminService.listRooms(propertyId);
    return sendSuccess(res, 'Rooms fetched successfully', data);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to list rooms', 500, error);
  }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { floorId, roomNumber, type, monthlyRent, bedCount } = req.body;
    if (!floorId || !roomNumber) {
      return sendError(res, 'Floor ID and room number are required', 400);
    }

    const room = await AdminService.createRoom({
      propertyId: req.body.propertyId || req.body.floorId,
      floorNumber: Number(req.body.floorNumber) || 1,
      roomNumber,
      type: (type as RoomType) || RoomType.DOUBLE_SHARING,
      monthlyRent: Number(monthlyRent) || 8500,
      bedCount: Number(bedCount) || 2,
    });

    return sendSuccess(res, 'Room created successfully', room, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create room', 500, error);
  }
};

export const updateBedStatus = async (req: AuthRequest, res: Response) => {
  try {
    const bedId = String(req.params.bedId);
    const { status } = req.body;
    if (!bedId || !status) return sendError(res, 'Bed ID and status required', 400);

    const updated = await AdminService.updateBedStatus(bedId, status as BedStatus);
    return sendSuccess(res, 'Bed status updated successfully', updated);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update bed status', 500, error);
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

    const data = await AdminService.listGateLogs(propertyId);
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

    const log = await AdminService.addGateLog({
      propertyId,
      userId: studentId,
      entryType: type.toUpperCase() === 'EXIT' ? 'EXIT' : 'ENTRY',
      passCode: req.body.passCode,
    });

    return sendSuccess(res, 'Gate log recorded successfully', log, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record gate log', 500, error);
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

