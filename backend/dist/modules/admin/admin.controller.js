"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComplaint = exports.getFinanceSummary = exports.createMaintenance = exports.listMaintenance = exports.updateFoodMenu = exports.getFoodMenu = exports.deleteNotice = exports.createNotice = exports.listNotices = exports.addGateLog = exports.listGateLogs = exports.updateComplaintStatus = exports.listComplaints = exports.onboardTenant = exports.listTenants = exports.createStaff = exports.listStaff = exports.updateBedStatus = exports.createRoom = exports.listRooms = exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getPropertyDetail = exports.listProperties = exports.getDashboardStats = void 0;
const admin_service_1 = require("./admin.service");
const response_1 = require("../../utils/response");
const client_1 = require("@prisma/client");
const getDashboardStats = async (req, res) => {
    try {
        const ownerId = req.user?.role === 'SUPERADMIN' ? req.query.ownerId || req.user.userId : req.user?.ownerId || req.user?.userId;
        const propertyId = req.query.propertyId;
        if (!ownerId)
            return (0, response_1.sendError)(res, 'Owner ID not found', 400);
        const data = await admin_service_1.AdminService.getDashboardStats(ownerId, propertyId);
        return (0, response_1.sendSuccess)(res, 'Dashboard statistics fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to fetch dashboard stats', 500, error);
    }
};
exports.getDashboardStats = getDashboardStats;
// ==========================================
// PROPERTIES
// ==========================================
const listProperties = async (req, res) => {
    try {
        const ownerId = req.user?.role === 'SUPERADMIN' ? req.query.ownerId || req.user.userId : req.user?.ownerId || req.user?.userId;
        if (!ownerId)
            return (0, response_1.sendError)(res, 'Owner ID required', 400);
        const data = await admin_service_1.AdminService.listProperties(ownerId);
        return (0, response_1.sendSuccess)(res, 'Properties fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to list properties', 500, error);
    }
};
exports.listProperties = listProperties;
const getPropertyDetail = async (req, res) => {
    try {
        const id = String(req.params.id);
        const ownerId = req.user?.role === 'SUPERADMIN' ? req.query.ownerId || req.user.userId : req.user?.ownerId || req.user?.userId;
        if (!id || !ownerId)
            return (0, response_1.sendError)(res, 'Property ID and Owner ID required', 400);
        const data = await admin_service_1.AdminService.getPropertyDetail(id, ownerId);
        if (!data)
            return (0, response_1.sendError)(res, 'Property not found', 404);
        return (0, response_1.sendSuccess)(res, 'Property details fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to fetch property detail', 500, error);
    }
};
exports.getPropertyDetail = getPropertyDetail;
const createProperty = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId;
        if (!ownerId)
            return (0, response_1.sendError)(res, 'Owner ID required', 400);
        const { name, type, address, city, state, pincode, contactPhone, contactEmail, amenities, rules, floorsCount, defaultDeposit, bedRent, generateRooms, singleRoomsCount, doubleRoomsCount, tripleRoomsCount } = req.body;
        if (!name || !address || !city) {
            return (0, response_1.sendError)(res, 'Name, address, and city are required', 400);
        }
        // Normalize UI-friendly type labels to the Prisma PropertyType enum
        const typeMap = {
            boys: client_1.PropertyType.BOYS_PG,
            boys_pg: client_1.PropertyType.BOYS_PG,
            girls: client_1.PropertyType.GIRLS_PG,
            girls_pg: client_1.PropertyType.GIRLS_PG,
            coed: client_1.PropertyType.COED_PG,
            coed_pg: client_1.PropertyType.COED_PG,
            hostel: client_1.PropertyType.HOSTEL,
            coliving: client_1.PropertyType.COLIVING,
        };
        const normalizedType = (type ? typeMap[String(type).toLowerCase()] : undefined) || client_1.PropertyType.BOYS_PG;
        const property = await admin_service_1.AdminService.createProperty(ownerId, {
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
        return (0, response_1.sendSuccess)(res, 'Property created successfully', property, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to create property', 500, error);
    }
};
exports.createProperty = createProperty;
const updateProperty = async (req, res) => {
    try {
        const id = String(req.params.id);
        const ownerId = req.user?.ownerId || req.user?.userId;
        if (!id || !ownerId)
            return (0, response_1.sendError)(res, 'Property ID required', 400);
        const updated = await admin_service_1.AdminService.updateProperty(id, ownerId, req.body);
        return (0, response_1.sendSuccess)(res, 'Property updated successfully', updated);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to update property', 500, error);
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res) => {
    try {
        const id = String(req.params.id);
        const ownerId = req.user?.ownerId || req.user?.userId;
        if (!id || !ownerId)
            return (0, response_1.sendError)(res, 'Property ID required', 400);
        await admin_service_1.AdminService.deleteProperty(id, ownerId);
        return (0, response_1.sendSuccess)(res, 'Property deleted successfully');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to delete property', 500, error);
    }
};
exports.deleteProperty = deleteProperty;
// ==========================================
// ROOMS & BEDS
// ==========================================
const listRooms = async (req, res) => {
    try {
        const propertyId = String(req.params.propertyId);
        if (!propertyId)
            return (0, response_1.sendError)(res, 'Property ID required', 400);
        const data = await admin_service_1.AdminService.listRooms(propertyId);
        return (0, response_1.sendSuccess)(res, 'Rooms fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to list rooms', 500, error);
    }
};
exports.listRooms = listRooms;
const createRoom = async (req, res) => {
    try {
        const { floorId, roomNumber, type, monthlyRent, bedCount } = req.body;
        if (!floorId || !roomNumber) {
            return (0, response_1.sendError)(res, 'Floor ID and room number are required', 400);
        }
        const room = await admin_service_1.AdminService.createRoom({
            propertyId: req.body.propertyId || req.body.floorId,
            floorNumber: Number(req.body.floorNumber) || 1,
            roomNumber,
            type: type || client_1.RoomType.DOUBLE_SHARING,
            monthlyRent: Number(monthlyRent) || 8500,
            bedCount: Number(bedCount) || 2,
        });
        return (0, response_1.sendSuccess)(res, 'Room created successfully', room, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to create room', 500, error);
    }
};
exports.createRoom = createRoom;
const updateBedStatus = async (req, res) => {
    try {
        const bedId = String(req.params.bedId);
        const { status } = req.body;
        if (!bedId || !status)
            return (0, response_1.sendError)(res, 'Bed ID and status required', 400);
        const updated = await admin_service_1.AdminService.updateBedStatus(bedId, status);
        return (0, response_1.sendSuccess)(res, 'Bed status updated successfully', updated);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to update bed status', 500, error);
    }
};
exports.updateBedStatus = updateBedStatus;
// ==========================================
// STAFF & MANAGERS
// ==========================================
const listStaff = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId;
        if (!ownerId)
            return (0, response_1.sendError)(res, 'Owner ID required', 400);
        const data = await admin_service_1.AdminService.listStaff(ownerId);
        return (0, response_1.sendSuccess)(res, 'Staff members fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to list staff', 500, error);
    }
};
exports.listStaff = listStaff;
const createStaff = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId;
        if (!ownerId)
            return (0, response_1.sendError)(res, 'Owner ID required', 400);
        const { fullName, email, phone, role, propertyIds, password } = req.body;
        if (!fullName || !email || !phone) {
            return (0, response_1.sendError)(res, 'Name, email, and phone are required', 400);
        }
        const staff = await admin_service_1.AdminService.createStaff(ownerId, {
            fullName,
            email,
            phone,
            role: role || client_1.UserRole.MANAGER,
            propertyId: Array.isArray(propertyIds) ? propertyIds[0] : (propertyIds || req.body.propertyId || ''),
        });
        return (0, response_1.sendSuccess)(res, 'Staff member created successfully', staff, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to create staff member', 500, error);
    }
};
exports.createStaff = createStaff;
// ==========================================
// TENANTS / RESIDENTS
// ==========================================
const listTenants = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId;
        const propertyId = req.query.propertyId;
        if (!ownerId)
            return (0, response_1.sendError)(res, 'Owner ID required', 400);
        const data = await admin_service_1.AdminService.listTenants(ownerId, propertyId);
        return (0, response_1.sendSuccess)(res, 'Tenants fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to list tenants', 500, error);
    }
};
exports.listTenants = listTenants;
const onboardTenant = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId;
        if (!ownerId)
            return (0, response_1.sendError)(res, 'Owner ID required', 400);
        const { propertyId, bedId, fullName, email, phone, monthlyRent, securityDeposit, parentName, parentPhone, permanentAddress, idProofNumber, checkInDate, } = req.body;
        if (!propertyId || !bedId || !fullName || !phone) {
            return (0, response_1.sendError)(res, 'Property, bed, name, and phone are required', 400);
        }
        const stay = await admin_service_1.AdminService.onboardTenant(ownerId, {
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
        return (0, response_1.sendSuccess)(res, 'Tenant onboarded successfully', stay, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to onboard tenant', 500, error);
    }
};
exports.onboardTenant = onboardTenant;
// ==========================================
// COMPLAINTS
// ==========================================
const listComplaints = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId;
        const propertyId = req.query.propertyId;
        if (!ownerId)
            return (0, response_1.sendError)(res, 'Owner ID required', 400);
        const data = await admin_service_1.AdminService.listComplaints(ownerId, propertyId);
        return (0, response_1.sendSuccess)(res, 'Complaints fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to list complaints', 500, error);
    }
};
exports.listComplaints = listComplaints;
const updateComplaintStatus = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { status, resolutionNotes } = req.body;
        if (!id || !status)
            return (0, response_1.sendError)(res, 'Complaint ID and status required', 400);
        const updated = await admin_service_1.AdminService.updateComplaintStatus(id, status);
        return (0, response_1.sendSuccess)(res, 'Complaint status updated successfully', updated);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to update complaint status', 500, error);
    }
};
exports.updateComplaintStatus = updateComplaintStatus;
// ==========================================
// GATE LOGS
// ==========================================
const listGateLogs = async (req, res) => {
    try {
        const propertyId = String(req.params.propertyId);
        if (!propertyId)
            return (0, response_1.sendError)(res, 'Property ID required', 400);
        const data = await admin_service_1.AdminService.listGateLogs(propertyId);
        return (0, response_1.sendSuccess)(res, 'Gate logs fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to list gate logs', 500, error);
    }
};
exports.listGateLogs = listGateLogs;
const addGateLog = async (req, res) => {
    try {
        const { propertyId, studentId, studentName, roomNumber, type, reason, destination, expectedReturnTime, isLate } = req.body;
        if (!propertyId || !studentId || !type) {
            return (0, response_1.sendError)(res, 'Property ID, student ID, and type are required', 400);
        }
        const log = await admin_service_1.AdminService.addGateLog({
            propertyId,
            userId: studentId,
            entryType: type.toUpperCase() === 'EXIT' ? 'EXIT' : 'ENTRY',
            passCode: req.body.passCode,
        });
        return (0, response_1.sendSuccess)(res, 'Gate log recorded successfully', log, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to record gate log', 500, error);
    }
};
exports.addGateLog = addGateLog;
// ==========================================
// NOTICES
// ==========================================
const listNotices = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId || '';
        const data = await admin_service_1.AdminService.listNotices(ownerId);
        return (0, response_1.sendSuccess)(res, 'Notices fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to fetch notices', 500, error);
    }
};
exports.listNotices = listNotices;
const createNotice = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId || '';
        const { title, content, category, target, isPinned } = req.body;
        if (!title || !content)
            return (0, response_1.sendError)(res, 'Title and content required', 400);
        const notice = await admin_service_1.AdminService.createNotice(ownerId, {
            title,
            message: content,
            propertyId: req.body.propertyId,
        });
        return (0, response_1.sendSuccess)(res, 'Notice created successfully', notice, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to create notice', 500, error);
    }
};
exports.createNotice = createNotice;
const deleteNotice = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId || '';
        const id = String(req.params.id);
        await admin_service_1.AdminService.deleteNotice(id);
        return (0, response_1.sendSuccess)(res, 'Notice deleted successfully', null);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to delete notice', 500, error);
    }
};
exports.deleteNotice = deleteNotice;
// ==========================================
// FOOD MENU
// ==========================================
const getFoodMenu = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId || '';
        const menu = await admin_service_1.AdminService.getFoodMenu(ownerId);
        return (0, response_1.sendSuccess)(res, 'Food menu fetched successfully', menu);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to fetch food menu', 500, error);
    }
};
exports.getFoodMenu = getFoodMenu;
const updateFoodMenu = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId || '';
        const { weekMenuJson } = req.body;
        if (!weekMenuJson)
            return (0, response_1.sendError)(res, 'Week menu JSON required', 400);
        const menu = await admin_service_1.AdminService.updateFoodMenu(ownerId, typeof weekMenuJson === 'string' ? weekMenuJson : JSON.stringify(weekMenuJson));
        return (0, response_1.sendSuccess)(res, 'Food menu updated successfully', menu);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to update food menu', 500, error);
    }
};
exports.updateFoodMenu = updateFoodMenu;
// ==========================================
// MAINTENANCE
// ==========================================
const listMaintenance = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId || '';
        const data = await admin_service_1.AdminService.listMaintenance(ownerId);
        return (0, response_1.sendSuccess)(res, 'Maintenance contracts fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to fetch maintenance contracts', 500, error);
    }
};
exports.listMaintenance = listMaintenance;
const createMaintenance = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId || '';
        const { vendorName, serviceType, startDate, endDate, cost, status } = req.body;
        if (!vendorName || !serviceType || !startDate || !endDate) {
            return (0, response_1.sendError)(res, 'Vendor name, service type, start and end date required', 400);
        }
        const item = await admin_service_1.AdminService.createMaintenance(ownerId, {
            propertyId: req.body.propertyId || '',
            title: vendorName || serviceType,
            amount: Number(cost || 0),
        });
        return (0, response_1.sendSuccess)(res, 'Maintenance contract created successfully', item, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to create maintenance contract', 500, error);
    }
};
exports.createMaintenance = createMaintenance;
// ==========================================
// FINANCE SUMMARY
// ==========================================
const getFinanceSummary = async (req, res) => {
    try {
        const ownerId = req.user?.ownerId || req.user?.userId || '';
        const data = await admin_service_1.AdminService.getFinanceSummary(ownerId);
        return (0, response_1.sendSuccess)(res, 'Finance summary fetched successfully', data);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to fetch finance summary', 500, error);
    }
};
exports.getFinanceSummary = getFinanceSummary;
// ==========================================
// CREATE COMPLAINT
// ==========================================
const createComplaint = async (req, res) => {
    try {
        const userId = req.user?.userId || '';
        const { propertyId, category, title, description, priority } = req.body;
        if (!propertyId || !category || !title || !description) {
            return (0, response_1.sendError)(res, 'Property ID, category, title, and description required', 400);
        }
        const complaint = await admin_service_1.AdminService.createComplaint(userId, {
            propertyId,
            title,
            description,
            category,
            priority: priority,
        });
        return (0, response_1.sendSuccess)(res, 'Complaint submitted successfully', complaint, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to create complaint', 500, error);
    }
};
exports.createComplaint = createComplaint;
