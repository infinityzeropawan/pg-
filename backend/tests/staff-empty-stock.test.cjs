const { test } = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

// Builds an in-memory Prisma double. No database connection is opened.
function installPrismaDouble({ role = 'STAFF', assigned = [], properties = [], stock = [] } = {}) {
  const calls = { reads: [], creates: [], updateMany: [] };
  const previousPrisma = globalThis.prisma;
  globalThis.prisma = {
    user: {
      findUnique: async () => ({ id: 'user-1', role, isActive: true, isSuspended: false, ownerId: 'owner-1' }),
    },
    staffAssignment: {
      findMany: async () => assigned.map(propertyId => ({ propertyId })),
    },
    property: {
      findMany: async (query) => {
        const ids = query?.where?.id?.in;
        return properties.filter(p => !ids || ids.includes(p.id));
      },
    },
    stockItem: {
      findMany: async (query) => {
        calls.reads.push(query);
        return stock;
      },
      create: async (query) => {
        calls.creates.push(query);
        return query.data;
      },
      updateMany: async (query) => {
        calls.updateMany.push(query);
        return { count: 0 };
      },
    },
    staffTask: {
      findMany: async () => [],
    },
  };

  return {
    calls,
    restore: () => {
      if (previousPrisma === undefined) delete globalThis.prisma;
      else globalThis.prisma = previousPrisma;
    },
  };
}

// db.ts captures `prisma` at import time, so the module cache must be cleared
// for each test to make the freshly installed double take effect.
function loadStaffService() {
  for (const modulePath of ['../src/db', '../src/modules/staff/staff.service']) {
    delete require.cache[require.resolve(modulePath)];
  }
  return require('../src/modules/staff/staff.service');
}

test('reading empty staff stock returns [] without creating sample inventory', async () => {
  const db = installPrismaDouble({ assigned: ['test-property'] });

  try {
    const { StaffService } = loadStaffService();
    const result = await StaffService.getStock('user-1');

    assert.deepEqual(result, []);
    assert.equal(db.calls.creates.length, 0, 'GET stock must not seed sample inventory');
    assert.deepEqual(db.calls.reads, [{
      where: { propertyId: { in: ['test-property'] } },
      orderBy: { itemName: 'asc' },
    }]);
  } finally {
    db.restore();
  }
});

test('staff can only read stock from properties assigned to them', async () => {
  const db = installPrismaDouble({ assigned: ['property-a'] });

  try {
    const { StaffService, StaffAccessError } = loadStaffService();

    const allowed = await StaffService.getStock('user-1', 'property-a');
    assert.deepEqual(allowed, []);
    assert.deepEqual(db.calls.reads[0].where, { propertyId: { in: ['property-a'] } });

    await assert.rejects(
      () => StaffService.getStock('user-1', 'property-b'),
      (error) => error instanceof StaffAccessError && error.statusCode === 403,
    );
    assert.equal(db.calls.reads.length, 1, 'unassigned property must be rejected before any read');
  } finally {
    db.restore();
  }
});

test('staff stock write is rejected when item is outside assigned properties', async () => {
  const db = installPrismaDouble({ assigned: ['property-a'] });

  try {
    const { StaffService, StaffAccessError } = loadStaffService();

    await assert.rejects(
      () => StaffService.updateStock('user-1', 'stock-1', 5),
      (error) => error instanceof StaffAccessError && error.statusCode === 404,
    );
    assert.deepEqual(db.calls.updateMany[0].where, { id: 'stock-1', propertyId: { in: ['property-a'] } });
  } finally {
    db.restore();
  }
});

test('owner stock scope uses owned properties only', async () => {
  const db = installPrismaDouble({
    role: 'OWNER',
    properties: [{ id: 'property-a' }, { id: 'property-b' }],
  });

  try {
    const { StaffService } = loadStaffService();
    await StaffService.getStock('user-1');
    assert.deepEqual(db.calls.reads[0].where, { propertyId: { in: ['property-a', 'property-b'] } });
  } finally {
    db.restore();
  }
});
