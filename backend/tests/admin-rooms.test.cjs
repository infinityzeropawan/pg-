const { test } = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

const SERVICE_PATH = '../src/modules/admin/admin.service';

const OWNER = { userId: 'owner-1', ownerId: 'owner-1', role: 'OWNER' };
const MANAGER = { userId: 'manager-1', ownerId: 'owner-1', role: 'MANAGER' };

/**
 * Records every write the room endpoints perform so tests can assert on the
 * exact rows/values handed to Prisma without a live database.
 */
function installPrismaDouble(overrides = {}) {
  const calls = { roomCreate: null, roomFindMany: null, roomDeleted: null, bedUpdateMany: [], bedUpdate: null, auditLogs: [] };

  const tx = {
    floor: { upsert: async (args) => ({ id: 'floor-1', ...args.create }) },
    room: {
      create: async (args) => {
        calls.roomCreate = args;
        return {
          id: 'room-new',
          floorId: args.data.floorId,
          roomNumber: args.data.roomNumber,
          type: args.data.type,
          monthlyRent: args.data.monthlyRent,
          beds: args.data.beds.create.map((bed, index) => ({ id: `bed-${index + 1}`, ...bed })),
        };
      },
    },
  };

  const base = {
    property: { findFirst: async () => ({ id: 'prop-1' }) },
    staffAssignment: { findFirst: async () => ({ id: 'assignment-1' }) },
    $transaction: async (fn) => fn(tx),
    auditLog: { create: async (args) => { calls.auditLogs.push(args.data); return args.data; } },
    room: {
      findUnique: async () => null,
      findMany: async (args) => { calls.roomFindMany = args; return []; },
      delete: async (args) => { calls.roomDeleted = args; return { id: args.where.id }; },
    },
    bed: {
      findUnique: async () => null,
      update: async (args) => { calls.bedUpdate = args; return { id: args.where.id, status: args.data.status }; },
      updateMany: async (args) => { calls.bedUpdateMany.push(args); return { count: args.where.id.in.length }; },
    },
  };

  const previousPrisma = globalThis.prisma;
  globalThis.prisma = {
    ...base,
    ...overrides,
    room: { ...base.room, ...(overrides.room || {}) },
    bed: { ...base.bed, ...(overrides.bed || {}) },
  };

  return {
    calls,
    restore: () => {
      if (previousPrisma === undefined) delete globalThis.prisma;
      else globalThis.prisma = previousPrisma;
    },
  };
}

function loadAdminService() {
  for (const modulePath of ['../src/db', SERVICE_PATH]) delete require.cache[require.resolve(modulePath)];
  return require(SERVICE_PATH).AdminService;
}

test('createRoom creates one vacant bed per sharing count and stores rent in paise', async () => {
  const db = installPrismaDouble();
  try {
    const AdminService = loadAdminService();
    const room = await AdminService.createRoom(
      { propertyId: 'prop-1', roomNumber: '204', floorNumber: 2, bedCount: 3, monthlyRent: 9500 },
      OWNER
    );

    const { BedStatus } = require('@prisma/client');
    assert.equal(db.calls.roomCreate.data.monthlyRent, 950000, 'rupees must be stored as paise');
    assert.equal(db.calls.roomCreate.data.type, 'TRIPLE_SHARING');
    assert.deepEqual(
      db.calls.roomCreate.data.beds.create,
      [
        { bedNumber: 'B-1', status: BedStatus.VACANT, monthlyRent: 950000 },
        { bedNumber: 'B-2', status: BedStatus.VACANT, monthlyRent: 950000 },
        { bedNumber: 'B-3', status: BedStatus.VACANT, monthlyRent: 950000 },
      ]
    );
    assert.equal(room.beds.length, 3);
    assert.equal(db.calls.auditLogs[0].action, 'ROOM_CREATED');
    assert.equal(db.calls.auditLogs[0].entityId, 'room-new');
  } finally {
    db.restore();
  }
});

test('createRoom resolves the floor number instead of accepting a raw floor id', async () => {
  const db = installPrismaDouble();
  try {
    const AdminService = loadAdminService();
    await AdminService.createRoom(
      { propertyId: 'prop-1', roomNumber: 'G-1', floorNumber: 0, bedCount: 1, monthlyRent: 5000 },
      OWNER
    );

    assert.equal(db.calls.roomCreate.data.type, 'SINGLE');
    assert.equal(db.calls.roomCreate.data.floorId, 'floor-1');
  } finally {
    db.restore();
  }
});

test('createRoom rejects an invalid sharing count before it reaches the database', async () => {
  const db = installPrismaDouble();
  try {
    const AdminService = loadAdminService();
    await assert.rejects(
      AdminService.createRoom(
        { propertyId: 'prop-1', roomNumber: '205', floorNumber: 2, bedCount: 0, monthlyRent: 9000 },
        OWNER
      ),
      (error) => error.statusCode === 400 && /Sharing count/.test(error.message)
    );
    assert.equal(db.calls.roomCreate, null, 'no room may be written for invalid input');
  } finally {
    db.restore();
  }
});

test('createRoom refuses a property the owner does not own', async () => {
  const db = installPrismaDouble({ property: { findFirst: async () => null } });
  try {
    const AdminService = loadAdminService();
    await assert.rejects(
      AdminService.createRoom(
        { propertyId: 'someone-elses', roomNumber: '301', floorNumber: 3, bedCount: 2, monthlyRent: 8000 },
        OWNER
      ),
      (error) => error.statusCode === 404
    );
    assert.equal(db.calls.roomCreate, null);
  } finally {
    db.restore();
  }
});

test('createRoom reports a duplicate room number as a conflict', async () => {
  const db = installPrismaDouble({
    $transaction: async () => {
      const error = new Error('Unique constraint failed on the fields: (`floorId`,`roomNumber`)');
      error.code = 'P2002';
      throw error;
    },
  });
  try {
    const AdminService = loadAdminService();
    await assert.rejects(
      AdminService.createRoom(
        { propertyId: 'prop-1', roomNumber: '204', floorNumber: 2, bedCount: 2, monthlyRent: 8000 },
        OWNER
      ),
      (error) => error.statusCode === 409 && /already exists/.test(error.message)
    );
  } finally {
    db.restore();
  }
});

function roomWithBeds(beds) {
  return {
    id: 'room-1',
    roomNumber: '204',
    floorId: 'floor-1',
    floor: { id: 'floor-1', floorNumber: 2, propertyId: 'prop-1' },
    beds,
  };
}

test('deleteRoom refuses while any bed is still occupied', async () => {
  const db = installPrismaDouble({
    room: {
      findUnique: async () => roomWithBeds([
        { id: 'bed-1', status: 'VACANT' },
        { id: 'bed-2', status: 'OCCUPIED' },
      ]),
    },
  });
  try {
    const AdminService = loadAdminService();
    await assert.rejects(
      AdminService.deleteRoom('room-1', OWNER),
      (error) => error.statusCode === 409 && /occupied/.test(error.message)
    );
    assert.equal(db.calls.roomDeleted, null, 'an occupied room must never be deleted');
  } finally {
    db.restore();
  }
});

test('deleteRoom removes a room whose beds are all free and logs the audit entry', async () => {
  const db = installPrismaDouble({
    room: {
      findUnique: async () => roomWithBeds([
        { id: 'bed-1', status: 'VACANT' },
        { id: 'bed-2', status: 'UNDER_MAINTENANCE' },
      ]),
    },
  });
  try {
    const AdminService = loadAdminService();
    const result = await AdminService.deleteRoom('room-1', OWNER);

    assert.equal(result.id, 'room-1');
    assert.deepEqual(db.calls.roomDeleted, { where: { id: 'room-1' } });
    assert.equal(db.calls.auditLogs[0].action, 'ROOM_DELETED');
    assert.equal(db.calls.auditLogs[0].details, JSON.stringify({ roomNumber: '204', bedCount: 2 }));
  } finally {
    db.restore();
  }
});

test('starting maintenance flips only the vacant beds', async () => {
  const db = installPrismaDouble({
    room: {
      findUnique: async () => roomWithBeds([
        { id: 'bed-1', status: 'VACANT' },
        { id: 'bed-2', status: 'OCCUPIED' },
        { id: 'bed-3', status: 'RESERVED' },
        { id: 'bed-4', status: 'UNDER_MAINTENANCE' },
      ]),
    },
  });
  try {
    const { BedStatus } = require('@prisma/client');
    const AdminService = loadAdminService();
    const result = await AdminService.setRoomMaintenance('room-1', true, OWNER);

    assert.deepEqual(db.calls.bedUpdateMany[0].where, { id: { in: ['bed-1'] } });
    assert.equal(db.calls.bedUpdateMany[0].data.status, BedStatus.UNDER_MAINTENANCE);
    assert.equal(result.updatedBeds, 1);
    assert.equal(db.calls.auditLogs[0].action, 'ROOM_MAINTENANCE_STARTED');
  } finally {
    db.restore();
  }
});

test('ending maintenance restores only the blocked beds to vacant', async () => {
  const db = installPrismaDouble({
    room: {
      findUnique: async () => roomWithBeds([
        { id: 'bed-1', status: 'UNDER_MAINTENANCE' },
        { id: 'bed-2', status: 'UNDER_MAINTENANCE' },
        { id: 'bed-3', status: 'OCCUPIED' },
      ]),
    },
  });
  try {
    const { BedStatus } = require('@prisma/client');
    const AdminService = loadAdminService();
    const result = await AdminService.setRoomMaintenance('room-1', false, OWNER);

    assert.deepEqual(db.calls.bedUpdateMany[0].where, { id: { in: ['bed-1', 'bed-2'] } });
    assert.equal(db.calls.bedUpdateMany[0].data.status, BedStatus.VACANT);
    assert.equal(result.updatedBeds, 2);
    assert.equal(db.calls.auditLogs[0].action, 'ROOM_MAINTENANCE_ENDED');
  } finally {
    db.restore();
  }
});

test('starting maintenance fails when the room has no vacant bed', async () => {
  const db = installPrismaDouble({
    room: { findUnique: async () => roomWithBeds([{ id: 'bed-1', status: 'OCCUPIED' }]) },
  });
  try {
    const AdminService = loadAdminService();
    await assert.rejects(
      AdminService.setRoomMaintenance('room-1', true, OWNER),
      (error) => error.statusCode === 409 && /No vacant beds/.test(error.message)
    );
    assert.equal(db.calls.bedUpdateMany.length, 0);
  } finally {
    db.restore();
  }
});

test('updateBedStatus rejects the legacy status names the UI used to send', async () => {
  const db = installPrismaDouble();
  try {
    const AdminService = loadAdminService();
    await assert.rejects(
      AdminService.updateBedStatus('bed-1', 'maintenance', OWNER),
      (error) => error.statusCode === 400 && /Unsupported bed status/.test(error.message)
    );
    assert.equal(db.calls.bedUpdate, null);
  } finally {
    db.restore();
  }
});

test('updateBedStatus writes a valid enum status through the API', async () => {
  const db = installPrismaDouble({
    bed: {
      findUnique: async () => ({
        id: 'bed-1',
        status: 'VACANT',
        room: { id: 'room-1', floor: { id: 'floor-1', propertyId: 'prop-1' } },
      }),
    },
  });
  try {
    const { BedStatus } = require('@prisma/client');
    const AdminService = loadAdminService();
    const bed = await AdminService.updateBedStatus('bed-1', BedStatus.UNDER_MAINTENANCE, OWNER);

    assert.deepEqual(db.calls.bedUpdate, {
      where: { id: 'bed-1' },
      data: { status: BedStatus.UNDER_MAINTENANCE },
    });
    assert.equal(bed.status, BedStatus.UNDER_MAINTENANCE);
  } finally {
    db.restore();
  }
});

test('a manager without a staff assignment cannot reach the rooms of a property', async () => {
  const db = installPrismaDouble({ staffAssignment: { findFirst: async () => null } });
  try {
    const AdminService = loadAdminService();
    await assert.rejects(
      AdminService.listRooms('prop-1', MANAGER),
      (error) => error.statusCode === 403
    );
  } finally {
    db.restore();
  }
});

test('listRooms scopes the query to the requested property', async () => {
  const db = installPrismaDouble();
  try {
    const AdminService = loadAdminService();
    await AdminService.listRooms('prop-1', OWNER);
    assert.equal(db.calls.roomFindMany.where.floor.propertyId, 'prop-1');
    assert.equal(db.calls.roomFindMany.include.beds, true);
  } finally {
    db.restore();
  }
});

