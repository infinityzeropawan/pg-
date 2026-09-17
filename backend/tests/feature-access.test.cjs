const { test } = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

const SERVICE_PATH = '../src/modules/features/features.service';

// Precedence: per-owner override > core > plan entitlement > catalog default.
test('resolveFeatureAccess applies the documented precedence', () => {
  const { resolveFeatureAccess } = require(SERVICE_PATH);

  const features = [
    { key: 'student_portal', isCore: false, defaultEnabled: false },
    { key: 'rent_invoicing', isCore: false, defaultEnabled: false },
    { key: 'property_management', isCore: true, defaultEnabled: true },
    { key: 'whatsapp_alerts', isCore: false, defaultEnabled: false },
  ];

  const planEntitlements = { student_portal: true, rent_invoicing: true, property_management: false };
  const ownerOverrides = { student_portal: false };

  const resolved = resolveFeatureAccess(features, planEntitlements, ownerOverrides);

  // Plan grants it, but the owner was explicitly cut off -> override wins.
  assert.deepEqual(resolved.student_portal, { key: 'student_portal', enabled: false, source: 'OVERRIDE' });
  // No override -> plan decides.
  assert.deepEqual(resolved.rent_invoicing, { key: 'rent_invoicing', enabled: true, source: 'PLAN' });
  // Core cannot be disabled by a plan.
  assert.deepEqual(resolved.property_management, { key: 'property_management', enabled: true, source: 'CORE' });
  // Neither configured -> catalog default, so nothing is accidentally granted.
  assert.deepEqual(resolved.whatsapp_alerts, { key: 'whatsapp_alerts', enabled: false, source: 'DEFAULT' });
});

test('unconfigured owner falls back to catalog defaults and grants nothing extra', () => {
  const { resolveFeatureAccess } = require(SERVICE_PATH);

  const resolved = resolveFeatureAccess([
    { key: 'mess_wallet', isCore: false, defaultEnabled: false },
    { key: 'student_portal', isCore: false, defaultEnabled: true },
  ]);

  assert.equal(resolved.mess_wallet.enabled, false);
  assert.equal(resolved.student_portal.enabled, true);
  assert.equal(resolved.student_portal.source, 'DEFAULT');
});

function installPrismaDouble({ feature, override, entitlements = {} } = {}) {
  const previousPrisma = globalThis.prisma;
  globalThis.prisma = {
    feature: { findUnique: async () => feature },
    featureFlag: { findUnique: async () => override },
    subscription: {
      findFirst: async () => ({
        plan: {
          entitlements: Object.entries(entitlements).map(([featureKey, isEnabled]) => ({ featureKey, isEnabled })),
        },
      }),
    },
  };
  return {
    restore: () => {
      if (previousPrisma === undefined) delete globalThis.prisma;
      else globalThis.prisma = previousPrisma;
    },
  };
}

function loadFeatureService() {
  for (const modulePath of ['../src/db', SERVICE_PATH]) delete require.cache[require.resolve(modulePath)];
  return require(SERVICE_PATH).FeatureService;
}

test('unknown catalog features are never gated', async () => {
  const db = installPrismaDouble({ feature: null });
  try {
    const FeatureService = loadFeatureService();
    assert.equal(await FeatureService.isFeatureEnabled('owner-1', 'not_in_catalog'), true);
  } finally {
    db.restore();
  }
});

test('explicit owner override wins over plan entitlement', async () => {
  const db = installPrismaDouble({
    feature: { key: 'mess_wallet', isCore: false, defaultEnabled: true, isActive: true },
    override: { isEnabled: false },
    entitlements: { mess_wallet: true },
  });
  try {
    const FeatureService = loadFeatureService();
    assert.equal(await FeatureService.isFeatureEnabled('owner-1', 'mess_wallet'), false);
  } finally {
    db.restore();
  }
});

test('plan entitlement decides when no override exists', async () => {
  const db = installPrismaDouble({
    feature: { key: 'mess_wallet', isCore: false, defaultEnabled: true, isActive: true },
    override: null,
    entitlements: { mess_wallet: false },
  });
  try {
    const FeatureService = loadFeatureService();
    assert.equal(await FeatureService.isFeatureEnabled('owner-1', 'mess_wallet'), false);
  } finally {
    db.restore();
  }
});

test('core features stay enabled even when a plan says otherwise', async () => {
  const db = installPrismaDouble({
    feature: { key: 'property_management', isCore: true, defaultEnabled: false, isActive: true },
    override: null,
    entitlements: { property_management: false },
  });
  try {
    const FeatureService = loadFeatureService();
    assert.equal(await FeatureService.isFeatureEnabled('owner-1', 'property_management'), true);
  } finally {
    db.restore();
  }
});
