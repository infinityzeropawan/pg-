"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
// Protected Admin / Owner / Manager Endpoints
router.use(auth_middleware_1.authenticateJwt, (0, auth_middleware_1.authorizeRoles)('OWNER', 'MANAGER', 'SUPERADMIN'));
// Dashboard & Finance Summary
router.get('/dashboard', admin_controller_1.getDashboardStats);
router.get('/finance/summary', admin_controller_1.getFinanceSummary);
// Properties CRUD
router.get('/properties', admin_controller_1.listProperties);
router.post('/properties', admin_controller_1.createProperty);
router.get('/properties/:id', admin_controller_1.getPropertyDetail);
router.put('/properties/:id', admin_controller_1.updateProperty);
router.delete('/properties/:id', admin_controller_1.deleteProperty);
// Rooms & Beds
router.get('/properties/:propertyId/rooms', admin_controller_1.listRooms);
router.post('/rooms', admin_controller_1.createRoom);
router.patch('/beds/:bedId/status', admin_controller_1.updateBedStatus);
// Staff & Managers
router.get('/staff', admin_controller_1.listStaff);
router.post('/staff', admin_controller_1.createStaff);
// Tenants / Residents
router.get('/tenants', admin_controller_1.listTenants);
router.post('/tenants/onboard', admin_controller_1.onboardTenant);
// Complaints
router.get('/complaints', admin_controller_1.listComplaints);
router.post('/complaints', admin_controller_1.createComplaint);
router.patch('/complaints/:id/status', admin_controller_1.updateComplaintStatus);
// Gate Logs & Attendance
router.get('/properties/:propertyId/gate-logs', admin_controller_1.listGateLogs);
router.post('/gate-logs', admin_controller_1.addGateLog);
// Notices & Announcements
router.get('/notices', admin_controller_1.listNotices);
router.post('/notices', admin_controller_1.createNotice);
router.delete('/notices/:id', admin_controller_1.deleteNotice);
// Food Menu
router.get('/food-menu', admin_controller_1.getFoodMenu);
router.put('/food-menu', admin_controller_1.updateFoodMenu);
// Maintenance & AMC Contracts
router.get('/maintenance', admin_controller_1.listMaintenance);
router.post('/maintenance', admin_controller_1.createMaintenance);
exports.default = router;
