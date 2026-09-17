import { prisma } from './db';

/**
 * Idempotent seeder for the feature matrix.
 *
 * - Creates/updates the canonical Feature catalog.
 * - Derives each plan's entitlements from its legacy `features` JSON array so that
 *   existing subscriptions keep exactly the access they had before this change.
 * - `enforced: false` entries are catalog-only placeholders (no runtime gate yet).
 *
 * Run with: npx ts-node src/seed-features.ts
 */

interface CatalogEntry {
  key: string;
  name: string;
  category: string;
  description: string;
  isCore: boolean;
  defaultEnabled: boolean;
  enforced: boolean;
  sortOrder: number;
}

const CATALOG: CatalogEntry[] = [
  {
    key: 'property_management',
    name: 'Property & Room Management',
    category: 'Core',
    description: 'Properties, rooms, beds and resident onboarding. Always included.',
    isCore: true,
    defaultEnabled: true,
    enforced: true,
    sortOrder: 10,
  },
  {
    key: 'student_portal',
    name: 'Resident Portal',
    category: 'Residents',
    description: 'Resident app access: invoices, complaints, mess, notices, attendance.',
    isCore: false,
    defaultEnabled: false,
    enforced: true,
    sortOrder: 20,
  },
  {
    key: 'basic_complaints',
    name: 'Complaint Management',
    category: 'Operations',
    description: 'Resident complaint logging and resolution workflow.',
    isCore: false,
    defaultEnabled: false,
    enforced: true,
    sortOrder: 30,
  },
  {
    key: 'rent_invoicing',
    name: 'Rent Invoicing & Payments',
    category: 'Finance',
    description: 'Generate rent invoices and record payments.',
    isCore: false,
    defaultEnabled: false,
    enforced: true,
    sortOrder: 40,
  },
  {
    key: 'mess_wallet',
    name: 'Mess Wallet & Meal Ordering',
    category: 'Operations',
    description: 'Mess wallet recharge, meal ordering and menu management.',
    isCore: false,
    defaultEnabled: false,
    enforced: true,
    sortOrder: 50,
  },
  {
    key: 'multi_property',
    name: 'Multiple Properties',
    category: 'Core',
    description: 'Add more than one PG. The first property is always allowed.',
    isCore: false,
    defaultEnabled: false,
    enforced: true,
    sortOrder: 60,
  },
  {
    key: 'whatsapp_alerts',
    name: 'WhatsApp Alerts',
    category: 'Notifications',
    description: 'Catalog placeholder — not wired to a runtime gate yet.',
    isCore: false,
    defaultEnabled: false,
    enforced: false,
    sortOrder: 70,
  },
  {
    key: 'custom_domain',
    name: 'Custom Domain',
    category: 'Branding',
    description: 'Catalog placeholder — not wired to a runtime gate yet.',
    isCore: false,
    defaultEnabled: false,
    enforced: false,
    sortOrder: 80,
  },
  {
    key: 'biometric_integration',
    name: 'Biometric Integration',
    category: 'Hardware',
    description: 'Catalog placeholder — not wired to a runtime gate yet.',
    isCore: false,
    defaultEnabled: false,
    enforced: false,
    sortOrder: 90,
  },
  {
    key: 'priority_support',
    name: 'Priority Support',
    category: 'Support',
    description: 'Catalog placeholder — not wired to a runtime gate yet.',
    isCore: false,
    defaultEnabled: false,
    enforced: false,
    sortOrder: 100,
  },
];

function parseLegacyFeatures(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

async function main() {
  console.log('🌱 Seeding feature catalog...');

  for (const entry of CATALOG) {
    await prisma.feature.upsert({
      where: { key: entry.key },
      update: {
        name: entry.name,
        description: entry.description,
        category: entry.category,
        isCore: entry.isCore,
        defaultEnabled: entry.defaultEnabled,
        enforced: entry.enforced,
        sortOrder: entry.sortOrder,
        isActive: true,
      },
      create: { ...entry, isActive: true },
    });
  }
  console.log(`✅ Feature catalog ready (${CATALOG.length} entries)`);

  const knownKeys = new Set(CATALOG.map(entry => entry.key));
  const plans = await prisma.platformPlan.findMany();

  for (const plan of plans) {
    const legacy = parseLegacyFeatures(plan.features);
    const grantsAll = legacy.includes('all_features');
    const unknown = legacy.filter(key => key !== 'all_features' && !knownKeys.has(key));
    if (unknown.length) console.log(`⚠️  Plan ${plan.code}: ignoring unknown legacy features ${unknown.join(', ')}`);

    for (const entry of CATALOG) {
      if (entry.isCore) continue; // core features never need an entitlement row
      const isEnabled = (grantsAll && entry.enforced) || legacy.includes(entry.key);
      await prisma.planFeature.upsert({
        where: { planId_featureKey: { planId: plan.id, featureKey: entry.key } },
        update: { isEnabled },
        create: { planId: plan.id, featureKey: entry.key, isEnabled },
      });
    }
    console.log(`✅ Plan ${plan.code}: entitlements synced`);
  }

  console.log('🎉 Feature seeding complete.');
}

main()
  .catch((error) => {
    console.error('❌ Feature seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
