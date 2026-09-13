"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.getCurrentUser = exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../db");
const jwt_1 = require("../../utils/jwt");
const response_1 = require("../../utils/response");
const login = async (req, res) => {
    try {
        const { email, password, expectedRole } = req.body;
        if (!email || !password) {
            return (0, response_1.sendError)(res, 'Email and password are required', 400);
        }
        const user = await db_1.prisma.user.findFirst({
            where: {
                email: email.trim().toLowerCase(),
                isActive: true,
                isSuspended: false,
            },
        });
        if (!user) {
            return (0, response_1.sendError)(res, 'Invalid credentials or account suspended', 401);
        }
        if (expectedRole && user.role !== expectedRole.toUpperCase()) {
            return (0, response_1.sendError)(res, `Account role mismatch. Expected ${expectedRole}`, 403);
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return (0, response_1.sendError)(res, 'Invalid credentials', 401);
        }
        const tokenPayload = {
            userId: user.id,
            role: user.role,
            ownerId: user.ownerId,
            email: user.email,
        };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
        // Record session
        await db_1.prisma.userSession.create({
            data: {
                userId: user.id,
                refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                ipAddress: req.ip || '',
                userAgent: req.get('user-agent') || '',
            },
        });
        // Record audit log
        await db_1.prisma.auditLog.create({
            data: {
                actorId: user.id,
                ownerId: user.ownerId,
                action: 'USER_LOGIN',
                entityType: 'User',
                entityId: user.id,
                details: JSON.stringify({ ip: req.ip, role: user.role }),
            },
        });
        return (0, response_1.sendSuccess)(res, 'Login successful', {
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role.toLowerCase(),
                ownerId: user.ownerId,
                mustChangePassword: user.mustChangePassword,
            },
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message || 'Login failed', 500, error);
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await db_1.prisma.userSession.updateMany({
                where: { refreshToken },
                data: { isRevoked: true },
            });
        }
        return (0, response_1.sendSuccess)(res, 'Logged out successfully');
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Logout failed', 500, error);
    }
};
exports.logout = logout;
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user)
            return (0, response_1.sendError)(res, 'Unauthenticated', 401);
        const user = await db_1.prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                ownerId: true,
                mustChangePassword: true,
                avatarUrl: true,
                isActive: true,
            },
        });
        if (!user)
            return (0, response_1.sendError)(res, 'User not found', 404);
        return (0, response_1.sendSuccess)(res, 'User fetched successfully', {
            id: user.id,
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role.toLowerCase(),
            ownerId: user.ownerId,
            mustChangePassword: user.mustChangePassword,
        });
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to fetch current user', 500, error);
    }
};
exports.getCurrentUser = getCurrentUser;
const changePassword = async (req, res) => {
    try {
        if (!req.user)
            return (0, response_1.sendError)(res, 'Unauthenticated', 401);
        const { oldPassword, newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            return (0, response_1.sendError)(res, 'New password must be at least 6 characters', 400);
        }
        const user = await db_1.prisma.user.findUnique({ where: { id: req.user.userId } });
        if (!user)
            return (0, response_1.sendError)(res, 'User not found', 404);
        if (oldPassword) {
            const isMatch = await bcryptjs_1.default.compare(oldPassword, user.passwordHash);
            if (!isMatch)
                return (0, response_1.sendError)(res, 'Current password is incorrect', 400);
        }
        const newHash = await bcryptjs_1.default.hash(newPassword, 10);
        await db_1.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: newHash,
                mustChangePassword: false,
            },
        });
        await db_1.prisma.auditLog.create({
            data: {
                actorId: user.id,
                action: 'PASSWORD_CHANGED',
                entityType: 'User',
                entityId: user.id,
            },
        });
        return (0, response_1.sendSuccess)(res, 'Password changed successfully');
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'Failed to change password', 500, error);
    }
};
exports.changePassword = changePassword;
