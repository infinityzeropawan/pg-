const { test } = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

const GATE_QR_PATH = '../src/utils/gateQr';
const DATETIME_PATH = '../src/utils/datetime';

// ── Gate tokens ──────────────────────────────────────────────
// The poster on the wall carries a signed token; without the signature anyone could
// print a poster for a property they do not live in.

test('a signed gate token round-trips back to its property', () => {
  const { signGateToken, verifyGateToken } = require(GATE_QR_PATH);

  const token = signGateToken('prop-123');
  assert.equal(verifyGateToken(token), 'prop-123');
  assert.match(token, /^spg1\.prop-123\.[A-Za-z0-9_-]+$/);
});

test('tampered, forged and malformed gate tokens are rejected', () => {
  const { signGateToken, verifyGateToken } = require(GATE_QR_PATH);

  const token = signGateToken('prop-123');
  const [prefix, propertyId, signature] = token.split('.');

  // Same signature, different property id.
  assert.equal(verifyGateToken(`${prefix}.prop-999.${signature}`), null);
  // Flipped signature character.
  const flipped = signature.slice(0, -1) + (signature.endsWith('A') ? 'B' : 'A');
  assert.equal(verifyGateToken(`${prefix}.${propertyId}.${flipped}`), null);
  // Structural junk.
  assert.equal(verifyGateToken(''), null);
  assert.equal(verifyGateToken('spg1.prop-123'), null);
  assert.equal(verifyGateToken(`vg1.prop-123.${signature}`), null);
  assert.equal(verifyGateToken(undefined), null);
  assert.equal(verifyGateToken(null), null);
});

test('extractGateToken reads bare tokens, deep links and rejects anything else', () => {
  const { extractGateToken, signGateToken } = require(GATE_QR_PATH);

  const token = signGateToken('prop-123');

  assert.equal(extractGateToken(token), token);
  assert.equal(extractGateToken(`  ${token}  `), token);
  assert.equal(extractGateToken(`https://app.example.com/student/attendance?gate=${token}`), token);
  assert.equal(extractGateToken(`/student/attendance?gate=${token}`), token);
  assert.equal(extractGateToken('https://app.example.com/student/attendance'), null);
  assert.equal(extractGateToken('hello world'), null);
  assert.equal(extractGateToken(''), null);
  assert.equal(extractGateToken(null), null);
});

test('gateScanPath encodes the token as the documented deep link', () => {
  const { gateScanPath, signGateToken } = require(GATE_QR_PATH);

  const token = signGateToken('prop-123');
  assert.equal(gateScanPath(token), `/student/attendance?gate=${encodeURIComponent(token)}`);
});

// ── Canonical attendance day ─────────────────────────────────
// Regression: the student gate flow stored local midnight while the admin upserts
// stored UTC midnight, so one real day produced two rows and the owner's date filter
// silently missed the gate-written row.

test('attendance days are canonicalised in the business timezone (IST)', () => {
  const { attendanceDate, attendanceDateFromKey, dayKey, dayRangeUtc, monthRangeUtc } = require(DATETIME_PATH);

  // 18:45Z is already the next day in IST (00:15).
  assert.equal(dayKey('2026-01-01T18:45:00.000Z'), '2026-01-02');
  // 18:29Z is still 23:59 IST on the same day.
  assert.equal(dayKey('2026-01-01T18:29:00.000Z'), '2026-01-01');

  assert.equal(attendanceDate('2026-01-01T18:45:00.000Z').toISOString(), '2026-01-02T00:00:00.000Z');

  // A 00:30 IST gate scan and a manual mark for 2026-01-02 must land on ONE row.
  assert.equal(
    attendanceDate('2026-01-01T19:00:00.000Z').getTime(),
    attendanceDateFromKey('2026-01-02').getTime()
  );

  // A full ISO timestamp is accepted as well as a plain YYYY-MM-DD.
  assert.equal(
    attendanceDateFromKey('2026-01-02T05:00:00.000Z').getTime(),
    attendanceDateFromKey('2026-01-02').getTime()
  );

  const range = dayRangeUtc('2026-01-02');
  assert.equal(range.gte.toISOString(), '2026-01-02T00:00:00.000Z');
  assert.equal(range.lt.toISOString(), '2026-01-03T00:00:00.000Z');

  const feb = monthRangeUtc('2026-02');
  assert.equal(feb.gte.toISOString(), '2026-02-01T00:00:00.000Z');
  assert.equal(feb.lt.toISOString(), '2026-03-01T00:00:00.000Z');

  // December must roll into the next January, not month 13.
  const dec = monthRangeUtc('2026-12');
  assert.equal(dec.lt.toISOString(), '2027-01-01T00:00:00.000Z');

  assert.equal(monthRangeUtc('not-a-month'), null);
  assert.equal(monthRangeUtc('2026-13'), null);
});

// ── Curfew ──────────────────────────────────────────────────
// `isLate` used to be a hardcoded 22:00 read off the *server's* clock.

test('curfew parsing accepts 24h and 12h formats and rejects nonsense', () => {
  const { parseCurfewMinutes } = require(DATETIME_PATH);

  assert.equal(parseCurfewMinutes('22:00'), 22 * 60);
  assert.equal(parseCurfewMinutes('23:30'), 23 * 60 + 30);
  assert.equal(parseCurfewMinutes('10:00 PM'), 22 * 60);
  assert.equal(parseCurfewMinutes('9:30 pm'), 21 * 60 + 30);
  assert.equal(parseCurfewMinutes('12:00 AM'), 0);
  assert.equal(parseCurfewMinutes('12:00 PM'), 12 * 60);
  assert.equal(parseCurfewMinutes('25:00'), null);
  assert.equal(parseCurfewMinutes('22:75'), null);
  assert.equal(parseCurfewMinutes('evening'), null);
  assert.equal(parseCurfewMinutes(''), null);
  assert.equal(parseCurfewMinutes(null), null);
});

test('late-entry detection follows the property curfew, not a hardcoded hour', () => {
  const { isLateEntry } = require(DATETIME_PATH);

  // IST wall-clock times expressed as UTC (IST = UTC+5:30).
  const ist = (hhmm) => new Date(`2026-01-02T${hhmm}:00.000Z`);

  // 23:00 IST is late for a 22:00 curfew but not for a 23:30 curfew.
  assert.equal(isLateEntry(ist('17:30'), '22:00'), true);
  assert.equal(isLateEntry(ist('17:30'), '23:30'), false);
  // 22:30 IST is not late for a 23:00 curfew — what the hardcoded 22:00 got wrong.
  assert.equal(isLateEntry(ist('17:00'), '23:00'), false);
  assert.equal(isLateEntry(ist('17:00'), '22:00'), true);
  // 21:00 IST is inside a 22:00 curfew.
  assert.equal(isLateEntry(ist('15:30'), '22:00'), false);
  // 04:00 IST is a spill-over return from the previous night, still late.
  assert.equal(isLateEntry(new Date('2026-01-01T22:30:00.000Z'), '22:00'), true);
  // 06:00 IST is a normal morning movement.
  assert.equal(isLateEntry(ist('00:30'), '22:00'), false);
  // A missing or garbled curfew falls back to the schema default.
  assert.equal(isLateEntry(ist('17:30'), null), true);
  assert.equal(isLateEntry(ist('17:30'), 'tomorrow'), true);
});
