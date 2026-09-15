import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticateJwt = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication token missing or invalid', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthenticated actor', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Forbidden: Role ${req.user.role} does not have access to this resource`, 403);
    }
    next();
  };
};

/**
 * Blocks all write operations (POST, PUT, PATCH, DELETE) for demo accounts.
 * Apply after `authenticateJwt` on any route that mutates data.
 * GET requests pass through freely so dashboards remain fully readable.
 */
export const blockDemoWrites = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.isDemo && req.method !== 'GET') {
    return sendError(
      res,
      '👀 Demo account — this action is view-only. Sign up for a real account to make changes.',
      403,
    );
  }
  next();
};
