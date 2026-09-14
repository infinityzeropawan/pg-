"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const superadmin_routes_1 = __importDefault(require("./modules/superadmin/superadmin.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const parent_routes_1 = __importDefault(require("./modules/parent/parent.routes"));
const staff_routes_1 = __importDefault(require("./modules/staff/staff.routes"));
const student_routes_1 = __importDefault(require("./modules/student/student.routes"));
const response_1 = require("./utils/response");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health Check
app.get('/health', (req, res) => {
    return (0, response_1.sendSuccess)(res, 'Smart PG Management Backend API is healthy', {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// API v1 Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/superadmin', superadmin_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
app.use('/api/v1/parent', parent_routes_1.default);
app.use('/api/v1/staff', staff_routes_1.default);
app.use('/api/v1/student', student_routes_1.default);
// 404 Handler
app.use((req, res) => {
    return (0, response_1.sendError)(res, `Route ${req.originalUrl} not found`, 404);
});
exports.default = app;
