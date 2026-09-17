const { test } = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

const SERVICE_PATH = '../src/modules/student/student.service';
const TOKEN_PATH = '../src/utils/gateQr';

const RESIDENT_ID = 'user-1';
const PROPERTY_ID = 'prop-1';

/**
 * Minimal Prisma double, mirroring the style used by feature-access.test.cjs: the
 * service imports `{ prisma } from '../../db'`, so installing the double on
 * globalThis before the module is required is enough.
 */
function installPrismaDouble(options = {}) {
  const previous = globalThis.prisma;
  const calls = { gateLogCreates: [], gateLogUpdates: [], attendanceCreates: [], attendanceUpdates: [], notifications: [] };

  globalThis.prisma = {
    user: {
      findUnique: async () => ({
        id: RESIDENT_ID,
        fullName: 'Aarav Sharma',
        tenantProfile: { id: 'tenant-1', parentProfileId: options.parentProfileId ?? 'parent-profile-1' },
      }),
    },
    tenantStay: {
      findFirst: async () => ({ propertyId: options.stayPropertyId ?? PROPERTY_ID, bed: { room: { roomNumber: '204' } } }),
    },
    property: {
      findUnique: async () => ({ curfewTime: options.curfewTime ?? '22:00' }),
    },
    gateLog: {
      findFirst: async () => options.duplicateLog ?? null,
      create: async ({ data }) => {
        calls.gateLogCreates.push(data);
        return { id: 'log-1', ...data };
      },
      update: async ({ data }) => {
        calls.gateLogUpdates.push(data);
        return { id: 'log-1', ...data };
      },
    },
    attendance: {
      findUnique: async () => options.existingAttendance ?? null,
      create: async ({ data }) => {
        calls.attendanceCreates.push(data);
        return { id: 'att-1', ...data };
      },
      update: async ({ data }) => {
        calls.attendanceUpdates.push(data);
        return { id: 'att-1', ...data };
      },
    },
    tenantProfile: {
      findUnique: async () => ({ parentProfile: options.parentProfileId === null ? null : { userId: 'parent-user-1' } }),
    },
    notificationLog: {
      create: async ({ data }) => {
        calls.notifications.push(data);
        return { id: 'note-1', ...data };
      },
    },
  };

  return {
    calls,
    restore: () => {
      if (previous === undefined) delete globalThis.prisma;
      else globalThis.prisma = previous;
    },
  };
}

function loadService() {
  for (const modulePath of ['../src/db', SERVICE_PATH]) delete require.cache[require.resolve(modulePath)];
  return require(SERVICE_PATH).StudentService;
}

async function withDouble(options, run) {
  const db = installPrismaDouble(options);
  try {
    return await run(loadService(), db);
  } finally {
    db.restore();
  }
}

test('a movement with no scanned token is rejected', async () => {
  await withDouble({}, async (StudentService) => {
    await assert.rejects(
      () => StudentService.recordGateAttendance(RESIDENT_ID, { type: 'entry' }),
      /Scan the gate QR poster/
    );
  });
});

test('a forged token is rejected', async () => {
  await withDouble({}, async (StudentService) => {
    await assert.rejects(
      () => StudentService.recordGateAttendance(RESIDENT_ID, { type: 'entry', gateToken: 'spg1.prop-1.not-a-real-signature' }),
      /not valid/
    );
  });
});

test('a poster from another property is rejected', async () => {
  const { signGateToken } = require(TOKEN_PATH);

  await withDouble({}, async (StudentService) => {
    await assert.rejects(
      () => StudentService.recordGateAttendance(RESIDENT_ID, { type: 'entry', gateToken: signGateToken('some-other-property') }),
      /different property/
    );
  });
});

test('an invalid movement type is rejected after the token checks pass', async () => {
  const { signGateToken } = require(TOKEN_PATH);

  await withDouble({}, async (StudentService) => {
    await assert.rejects(
      () => StudentService.recordGateAttendance(RESIDENT_ID, { type: 'sideways', gateToken: signGateToken(PROPERTY_ID) }),
      /ENTRY or EXIT/
    );
  });
});

test('a verified scan records the movement and marks the day present', async () => {
  const { signGateToken } = require(TOKEN_PATH);
  const token = signGateToken(PROPERTY_ID);

  await withDouble({}, async (StudentService, db) => {
    const result = await StudentService.recordGateAttendance(RESIDENT_ID, {
      type: 'entry',
      reason: 'College classes',
      gateToken: token,
    });

    assert.equal(db.calls.gateLogCreates.length, 1);
    const log = db.calls.gateLogCreates[0];
    assert.equal(log.propertyId, PROPERTY_ID);
    assert.equal(log.type, 'ENTRY');
    assert.equal(log.loggedBy, 'Gate QR Scan');
    assert.equal(log.passCode, token); // audit trail: which poster was scanned
    assert.equal(log.roomNumber, '204');
    assert.equal(log.studentName, 'Aarav Sharma');

    // The attendance row uses the canonical day key (a UTC midnight).
    assert.equal(db.calls.attendanceCreates.length, 1);
    const attendance = db.calls.attendanceCreates[0];
    assert.equal(attendance.status, 'PRESENT');
    assert.equal(attendance.propertyId, PROPERTY_ID);
    assert.equal(attendance.userId, RESIDENT_ID);
    assert.equal(attendance.date.getUTCHours(), 0);
    assert.equal(attendance.date.getUTCMinutes(), 0);
    assert.ok(Math.abs(Date.now() - attendance.date.getTime()) < 26 * 60 * 60 * 1000);
    assert.match(attendance.remarks, /^Gate entry at \d{2}:\d{2}$/);

    // Parent notification is persisted and stamped onto the log itself.
    assert.equal(db.calls.notifications.length, 1);
    assert.equal(db.calls.gateLogUpdates.length, 1);
    assert.ok(db.calls.gateLogUpdates[0].parentNotifiedAt instanceof Date);
    assert.equal(result.parentNotified, true);
  });
});

test('an approved leave day keeps its status when the resident scans in', async () => {
  const { signGateToken } = require(TOKEN_PATH);

  await withDouble({ existingAttendance: { id: 'att-9', status: 'ON_LEAVE' } }, async (StudentService, db) => {
    await StudentService.recordGateAttendance(RESIDENT_ID, { type: 'entry', gateToken: signGateToken(PROPERTY_ID) });

    // The old code never touched an existing row; the new one refreshes remarks only.
    assert.equal(db.calls.attendanceCreates.length, 0);
    assert.equal(db.calls.attendanceUpdates.length, 1);
    assert.equal(db.calls.attendanceUpdates[0].status, 'ON_LEAVE');
    assert.match(db.calls.attendanceUpdates[0].remarks, /^Gate entry at/);
  });
});

test('a rapid duplicate scan is collapsed instead of spamming the register', async () => {
  const { signGateToken } = require(TOKEN_PATH);
  const existingLog = { id: 'log-9', type: 'ENTRY', parentNotifiedAt: new Date(), timestamp: new Date() };

  await withDouble({ duplicateLog: existingLog }, async (StudentService, db) => {
    const result = await StudentService.recordGateAttendance(RESIDENT_ID, {
      type: 'entry',
      gateToken: signGateToken(PROPERTY_ID),
    });

    assert.equal(result.duplicate, true);
    assert.equal(result.id, 'log-9');
    assert.equal(result.parentNotified, true);
    assert.equal(db.calls.gateLogCreates.length, 0);
    assert.equal(db.calls.attendanceCreates.length, 0);
    assert.equal(db.calls.attendanceUpdates.length, 0);
    assert.equal(db.calls.notifications.length, 0);
  });
});

test('the parent alert is only claimed when a notification was really written', async () => {
  const { signGateToken } = require(TOKEN_PATH);

  await withDouble({ parentProfileId: null }, async (StudentService, db) => {
    const result = await StudentService.recordGateAttendance(RESIDENT_ID, {
      type: 'exit',
      destination: 'Market',
      gateToken: signGateToken(PROPERTY_ID),
    });

    assert.equal(db.calls.notifications.length, 0);
    assert.equal(db.calls.gateLogUpdates.length, 0);
    assert.equal(result.parentNotified, false);
    assert.equal(result.parentNotifiedAt, null);
  });
});

test('getGateLogs reports per-log parent notification truth', async () => {
  const notifiedAt = new Date();
  const previous = globalThis.prisma;

  globalThis.prisma = {
    gateLog: {
      findMany: async () => [
        { id: 'log-1', parentNotifiedAt: notifiedAt },
        { id: 'log-2', parentNotifiedAt: null },
      ],
    },
  };

  try {
    for (const modulePath of ['../src/db', SERVICE_PATH]) delete require.cache[require.resolve(modulePath)];
    const StudentService = require(SERVICE_PATH).StudentService;
    const logs = await StudentService.getGateLogs(RESIDENT_ID);

    assert.equal(logs[0].parentNotified, true);
    assert.equal(logs[1].parentNotified, false);
  } finally {
    if (previous === undefined) delete globalThis.prisma;
    else globalThis.prisma = previous;
  }
});
