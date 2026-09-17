import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';
import { FeatureService } from './features.service';

/**
 * Effective feature set for the signed-in tenant. The frontend uses this to hide
 * modules the owner's plan does not include, so UI and API guards agree.
 */
export const getMyFeatures = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'Unauthenticated actor', 401);

    const ownerId = user.ownerId || (user.role === 'OWNER' ? user.userId : null);

    // SuperAdmin (or a scope we cannot resolve) sees the whole catalog as enabled.
    if (!ownerId) {
      const catalog = await FeatureService.listCatalog();
      return sendSuccess(res, 'Features fetched successfully', {
        role: user.role,
        ownerId: null,
        features: catalog.map(feature => ({ key: feature.key, enabled: true, source: 'CORE' })),
      });
    }

    const effective = await FeatureService.getEffectiveFeatures(ownerId);
    return sendSuccess(res, 'Features fetched successfully', {
      role: user.role,
      ownerId,
      features: Object.values(effective),
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch features', 500, error);
  }
};
