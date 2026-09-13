"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBroadcast = exports.updateTicketStatus = exports.createTicket = exports.listTickets = exports.updateFeatureFlag = exports.listFeatureFlags = exports.updateSettings = exports.getSettings = exports.resetOwnerPassword = exports.getOwnerDetail = exports.listAuditLogs = exports.updatePlan = exports.createPlan = exports.listPlans = exports.toggleOwnerSuspension = exports.createOwner = exports.listOwners = exports.updateOwnerRequestStatus = exports.createOwnerRequest = exports.listOwnerRequests = exports.getAnalytics = exports.getDashboardStats = void 0;
const superadmin_service_1 = require("./superadmin.service");
const response_1 = require("../../utils/response");
const getDashboardStats = async (req, res) => {
    try {
        const stats = await superadmin_service_1.SuperadminService.getDashboardStats();
        return (0, response_1.sendSuccess)(res, 'Dashboard stats fetched successfully', stats);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch dashboard stats', 500, error);
    }
};
exports.getDashboardStats = getDashboardStats;
const getAnalytics = async (req, res) => {
    try {
        const analytics = await superadmin_service_1.SuperadminService.getAnalyticsData();
        return (0, response_1.sendSuccess)(res, 'Analytics fetched successfully', analytics);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch analytics', 500, error);
    }
};
exports.getAnalytics = getAnalytics;
const listOwnerRequests = async (req, res) => {
    try {
        const requests = await superadmin_service_1.SuperadminService.listOwnerRequests();
        return (0, response_1.sendSuccess)(res, 'Owner requests fetched successfully', requests);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch owner requests', 500, error);
    }
};
exports.listOwnerRequests = listOwnerRequests;
const createOwnerRequest = async (req, res) => {
    try {
        const newRequest = await superadmin_service_1.SuperadminService.createOwnerRequest(req.body);
        return (0, response_1.sendSuccess)(res, 'Owner request submitted successfully', newRequest, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to submit owner request', 400, error);
    }
};
exports.createOwnerRequest = createOwnerRequest;
const updateOwnerRequestStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, reason } = req.body;
        const actorId = req.user?.userId || '';
        if (!['APPROVED', 'REJECTED', 'UNDER_REVIEW'].includes(status)) {
            return (0, response_1.sendError)(res, 'Invalid owner request status', 400);
        }
        const updated = await superadmin_service_1.SuperadminService.updateOwnerRequestStatus(id, status, actorId, reason);
        return (0, response_1.sendSuccess)(res, `Owner request ${status.toLowerCase()} successfully`, updated);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to update owner request status', 400, error);
    }
};
exports.updateOwnerRequestStatus = updateOwnerRequestStatus;
const listOwners = async (req, res) => {
    try {
        const owners = await superadmin_service_1.SuperadminService.listOwners();
        return (0, response_1.sendSuccess)(res, 'Owners fetched successfully', owners);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch owners', 500, error);
    }
};
exports.listOwners = listOwners;
const createOwner = async (req, res) => {
    try {
        const adminId = req.user?.userId || '';
        const newOwner = await superadmin_service_1.SuperadminService.createOwner(adminId, req.body);
        return (0, response_1.sendSuccess)(res, 'Owner account created successfully', newOwner, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to create owner', 400, error);
    }
};
exports.createOwner = createOwner;
const toggleOwnerSuspension = async (req, res) => {
    try {
        const id = req.params.id;
        const { isSuspended } = req.body;
        const adminId = req.user?.userId || '';
        const updated = await superadmin_service_1.SuperadminService.updateOwnerStatus(id, isSuspended, adminId);
        return (0, response_1.sendSuccess)(res, `Owner account ${isSuspended ? 'suspended' : 'activated'}`, updated);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to update owner status', 400, error);
    }
};
exports.toggleOwnerSuspension = toggleOwnerSuspension;
const listPlans = async (req, res) => {
    try {
        const plans = await superadmin_service_1.SuperadminService.listPlans();
        return (0, response_1.sendSuccess)(res, 'Plans fetched successfully', plans);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch plans', 500, error);
    }
};
exports.listPlans = listPlans;
const createPlan = async (req, res) => {
    try {
        const plan = await superadmin_service_1.SuperadminService.createPlan(req.body, req.user?.userId);
        return (0, response_1.sendSuccess)(res, 'Plan created successfully', plan, 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to create plan', 400, error);
    }
};
exports.createPlan = createPlan;
const updatePlan = async (req, res) => {
    try {
        const id = req.params.id;
        const adminId = req.user?.userId || '';
        const updated = await superadmin_service_1.SuperadminService.updatePlan(id, req.body, adminId);
        return (0, response_1.sendSuccess)(res, 'Plan updated successfully', updated);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to update plan', 400, error);
    }
};
exports.updatePlan = updatePlan;
const listAuditLogs = async (req, res) => {
    try {
        const logs = await superadmin_service_1.SuperadminService.listAuditLogs();
        return (0, response_1.sendSuccess)(res, 'Audit logs fetched successfully', logs);
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch audit logs', 500, error);
    }
};
exports.listAuditLogs = listAuditLogs;
const getOwnerDetail = async (req, res) => {
    try {
        return (0, response_1.sendSuccess)(res, 'Owner details fetched successfully', await superadmin_service_1.SuperadminService.getOwnerDetail(req.params.id));
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to fetch owner details', 400, error);
    }
};
exports.getOwnerDetail = getOwnerDetail;
const resetOwnerPassword = async (req, res) => {
    try {
        return (0, response_1.sendSuccess)(res, 'Owner password reset successfully', await superadmin_service_1.SuperadminService.resetOwnerPassword(req.params.id, req.body.newPassword, req.user?.userId || ''));
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to reset owner password', 400, error);
    }
};
exports.resetOwnerPassword = resetOwnerPassword;
const getSettings = async (_req, res) => {
    try {
        return (0, response_1.sendSuccess)(res, 'Platform settings fetched successfully', await superadmin_service_1.SuperadminService.getSettings());
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch platform settings', 500, error);
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        return (0, response_1.sendSuccess)(res, 'Platform settings updated successfully', await superadmin_service_1.SuperadminService.updateSettings(req.body, req.user?.userId || ''));
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to update platform settings', 400, error);
    }
};
exports.updateSettings = updateSettings;
const listFeatureFlags = async (_req, res) => {
    try {
        return (0, response_1.sendSuccess)(res, 'Feature flags fetched successfully', await superadmin_service_1.SuperadminService.listFeatureFlags());
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch feature flags', 500, error);
    }
};
exports.listFeatureFlags = listFeatureFlags;
const updateFeatureFlag = async (req, res) => {
    try {
        const { key, ownerId, isEnabled, description } = req.body;
        if (!key || !ownerId || typeof isEnabled !== 'boolean')
            return (0, response_1.sendError)(res, 'key, ownerId, and isEnabled are required', 400);
        return (0, response_1.sendSuccess)(res, 'Feature flag updated successfully', await superadmin_service_1.SuperadminService.toggleFeatureFlag(key, ownerId, isEnabled, req.user?.userId || '', description));
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to update feature flag', 400, error);
    }
};
exports.updateFeatureFlag = updateFeatureFlag;
const listTickets = async (_req, res) => {
    try {
        return (0, response_1.sendSuccess)(res, 'Support tickets fetched successfully', await superadmin_service_1.SuperadminService.listTickets());
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch support tickets', 500, error);
    }
};
exports.listTickets = listTickets;
const createTicket = async (req, res) => {
    try {
        return (0, response_1.sendSuccess)(res, 'Support ticket created successfully', await superadmin_service_1.SuperadminService.createTicket(req.body, req.user?.userId || ''), 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to create support ticket', 400, error);
    }
};
exports.createTicket = createTicket;
const updateTicketStatus = async (req, res) => {
    try {
        return (0, response_1.sendSuccess)(res, 'Support ticket updated successfully', await superadmin_service_1.SuperadminService.updateTicketStatus(req.params.id, req.body.status, req.user?.userId || ''));
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to update support ticket', 400, error);
    }
};
exports.updateTicketStatus = updateTicketStatus;
const createBroadcast = async (req, res) => {
    try {
        return (0, response_1.sendSuccess)(res, 'Broadcast sent successfully', await superadmin_service_1.SuperadminService.createBroadcast(req.body.message, req.user?.userId || ''), 201);
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Failed to send broadcast', 400, error);
    }
};
exports.createBroadcast = createBroadcast;
