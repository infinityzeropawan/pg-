"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateJwt = void 0;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return (0, response_1.sendError)(res, 'Authentication token missing or invalid', 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (err) {
        return (0, response_1.sendError)(res, 'Invalid or expired token', 401);
    }
};
exports.authenticateJwt = authenticateJwt;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_1.sendError)(res, 'Unauthenticated actor', 401);
        }
        if (!roles.includes(req.user.role)) {
            return (0, response_1.sendError)(res, `Forbidden: Role ${req.user.role} does not have access to this resource`, 403);
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
