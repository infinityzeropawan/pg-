import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { sendError } from '../utils/response';
import { FeatureService } from '../modules/features/features.service';

/**
 * Resolve the tenant (owner) whose plan governs this request.
 * SUPERADMIN is never gated. If a tenant cannot be resolved the request is allowed
 * through, because there is no subscription to evaluate against.
 */
function resolveOwnerId(req: AuthRequest): string | null {
  const user = req.user;
  if (!user) return null;
  if (user.role === 'SUPERADMIN') return null;
  if (user.ownerId) return user.ownerId;
  if (user.role === 'OWNER') return user.userId;
  return null;
}

/**
 * Route guard enforcing plan entitlements + per-owner overrides.
 * All listed feature keys must be enabled.
 *
 * Usage: router.get('/wallet', authenticateJwt, requireFeature('mess_wallet'), handler)
 */
export const requireFeature = (...keys: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, 'Unauthenticated actor', 401);
    if (req.user.role === 'SUPERADMIN') return next();

    const ownerId = resolveOwnerId(req);
    if (!ownerId) return next();

    try {
      for (const key of keys) {
        const enabled = await FeatureService.isFeatureEnabled(ownerId, key);
        if (!enabled) {
          return sendError(res, `Your current plan does not include "${key}". Upgrade to enable this feature.`, 403);
        }
      }
      return next();
    } catch (error) {
      // A guard must never take the API down: log and allow when the check itself fails.
      console.error('[features] entitlement check failed:', error);
      return next();
    }
  };
};

/**
 * Allows creating an additional property only when the tenant's plan includes
 * `multi_property`. The very first property is always allowed.
 */
export const requirePropertyQuota = () => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, 'Unauthenticated actor', 401);
    if (req.user.role === 'SUPERADMIN') return next();

    const ownerId = resolveOwnerId(req);
    if (!ownerId) return next();

    try {
      const allowed = await FeatureService.canAddProperty(ownerId);
      if (!allowed) {
        return sendError(res, 'Your current plan is limited to a single property. Upgrade to add more.', 403);
      }
      return next();
    } catch (error) {
      console.error('[features] property quota check failed:', error);
      return next();
    }
  };
};
