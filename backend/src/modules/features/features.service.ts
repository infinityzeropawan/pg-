import { prisma } from '../../db';

export type FeatureSource = 'CORE' | 'OVERRIDE' | 'PLAN' | 'DEFAULT';

export interface FeatureDefinition {
  key: string;
  isCore: boolean;
  defaultEnabled: boolean;
}

export interface ResolvedFeature {
  key: string;
  enabled: boolean;
  source: FeatureSource;
}

type FlagMap = Map<string, boolean> | Record<string, boolean>;

function lookup(map: FlagMap, key: string): boolean | undefined {
  if (map instanceof Map) return map.get(key);
  return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;
}

/**
 * Pure resolution of a single feature. Precedence:
 *  1. explicit per-owner override (FeatureFlag)
 *  2. core feature (always on)
 *  3. plan entitlement (active subscription)
 *  4. catalog default
 * Unknown owners/keys are handled by the caller (unconfigured features are not gated).
 */
export function resolveFeatureAccess(
  features: FeatureDefinition[],
  planEntitlements: FlagMap = new Map(),
  ownerOverrides: FlagMap = new Map(),
): Record<string, ResolvedFeature> {
  const resolved: Record<string, ResolvedFeature> = {};

  for (const feature of features) {
    const override = lookup(ownerOverrides, feature.key);
    if (override !== undefined) {
      resolved[feature.key] = { key: feature.key, enabled: override, source: 'OVERRIDE' };
      continue;
    }
    if (feature.isCore) {
      resolved[feature.key] = { key: feature.key, enabled: true, source: 'CORE' };
      continue;
    }
    const entitlement = lookup(planEntitlements, feature.key);
    if (entitlement !== undefined) {
      resolved[feature.key] = { key: feature.key, enabled: entitlement, source: 'PLAN' };
      continue;
    }
    resolved[feature.key] = { key: feature.key, enabled: feature.defaultEnabled, source: 'DEFAULT' };
  }

  return resolved;
}

export class FeatureService {
  /** Catalog of every feature that SuperAdmin can hand out. */
  static async listCatalog() {
    return prisma.feature.findMany({ orderBy: [{ sortOrder: 'asc' }, { key: 'asc' }] });
  }

  static async upsertFeature(data: {
    key: string;
    name?: string;
    description?: string;
    category?: string;
    isCore?: boolean;
    defaultEnabled?: boolean;
    enforced?: boolean;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    if (!data.key || !/^[a-z0-9_]+$/.test(data.key)) {
      throw new Error('Feature key must be lowercase snake_case');
    }
    const { key, ...rest } = data;
    return prisma.feature.upsert({
      where: { key },
      update: { ...rest },
      create: {
        key,
        name: rest.name || key.replace(/_/g, ' '),
        description: rest.description,
        category: rest.category || 'General',
        isCore: rest.isCore ?? false,
        defaultEnabled: rest.defaultEnabled ?? false,
        enforced: rest.enforced ?? true,
        sortOrder: rest.sortOrder ?? 0,
        isActive: rest.isActive ?? true,
      },
    });
  }

  /** Replace a plan's feature entitlements in one transaction. */
  static async setPlanFeatures(planId: string, items: Array<{ featureKey: string; isEnabled: boolean }>) {
    const plan = await prisma.platformPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');

    const catalog = await prisma.feature.findMany({ select: { key: true } });
    const known = new Set(catalog.map(f => f.key));
    const invalid = items.filter(item => !known.has(item.featureKey));
    if (invalid.length) throw new Error(`Unknown feature keys: ${invalid.map(i => i.featureKey).join(', ')}`);

    return prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.planFeature.upsert({
          where: { planId_featureKey: { planId, featureKey: item.featureKey } },
          update: { isEnabled: item.isEnabled },
          create: { planId, featureKey: item.featureKey, isEnabled: item.isEnabled },
        });
      }
      return tx.planFeature.findMany({ where: { planId }, orderBy: { featureKey: 'asc' } });
    });
  }

  /** Effective entitlement map for an owner, derived from their active subscription plan. */
  static async getPlanEntitlements(ownerId: string): Promise<Record<string, boolean>> {
    const subscription = await prisma.subscription.findFirst({
      where: { ownerId, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { plan: { include: { entitlements: true } } },
    });
    if (!subscription) return {};

    const map: Record<string, boolean> = {};
    for (const row of subscription.plan.entitlements) map[row.featureKey] = row.isEnabled;
    return map;
  }

  static async getOwnerOverrides(ownerId: string): Promise<Record<string, boolean>> {
    const flags = await prisma.featureFlag.findMany({ where: { ownerId } });
    return Object.fromEntries(flags.map(flag => [flag.key, flag.isEnabled]));
  }

  /** Full effective feature map for an owner (used by API guards and the tenant UI). */
  static async getEffectiveFeatures(ownerId: string): Promise<Record<string, ResolvedFeature>> {
    const [features, planEntitlements, ownerOverrides] = await Promise.all([
      prisma.feature.findMany({ where: { isActive: true }, select: { key: true, isCore: true, defaultEnabled: true } }),
      FeatureService.getPlanEntitlements(ownerId),
      FeatureService.getOwnerOverrides(ownerId),
    ]);
    return resolveFeatureAccess(features, planEntitlements, ownerOverrides);
  }

  /**
   * Runtime check used by route guards.
   * Features absent from the catalog are never gated, so adding this guard cannot
   * silently break an existing endpoint that has no configuration yet.
   */
  static async isFeatureEnabled(ownerId: string, key: string): Promise<boolean> {
    const feature = await prisma.feature.findUnique({ where: { key } });
    if (!feature || !feature.isActive) return true;

    const override = await prisma.featureFlag.findUnique({ where: { key_ownerId: { key, ownerId } } });
    if (override) return override.isEnabled;
    if (feature.isCore) return true;

    const entitlements = await FeatureService.getPlanEntitlements(ownerId);
    if (Object.prototype.hasOwnProperty.call(entitlements, key)) return entitlements[key];
    return feature.defaultEnabled;
  }

  /** Owner x feature grid backing the SuperAdmin matrix screen. */
  static async getMatrix() {
    const [features, owners, plans, subscriptions] = await Promise.all([
      FeatureService.listCatalog(),
      prisma.user.findMany({
        where: { role: 'OWNER' },
        select: { id: true, fullName: true, email: true, isSuspended: true },
        orderBy: { fullName: 'asc' },
      }),
      prisma.platformPlan.findMany({ include: { entitlements: true }, orderBy: { priceMonthly: 'asc' } }),
      prisma.subscription.findMany({
        where: { isActive: true },
        include: { plan: { select: { code: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const planByOwner = new Map<string, { code: string; name: string }>();
    for (const subscription of subscriptions) {
      if (!planByOwner.has(subscription.ownerId)) {
        planByOwner.set(subscription.ownerId, subscription.plan);
      }
    }

    const ownerRows = await Promise.all(
      owners.map(async (owner) => ({
        ownerId: owner.id,
        name: owner.fullName,
        email: owner.email,
        isSuspended: owner.isSuspended,
        plan: planByOwner.get(owner.id) || null,
        effective: await FeatureService.getEffectiveFeatures(owner.id),
      })),
    );

    return { features, plans, owners: ownerRows };
  }

  /**
   * `multi_property` means an owner may add a second (or later) property only when the
   * feature is enabled. The first property is always allowed so onboarding never breaks.
   */
  static async canAddProperty(ownerId: string): Promise<boolean> {
    const existing = await prisma.property.count({ where: { ownerId } });
    if (existing === 0) return true;
    return FeatureService.isFeatureEnabled(ownerId, 'multi_property');
  }
}

