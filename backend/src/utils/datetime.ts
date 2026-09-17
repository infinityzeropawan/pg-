/**
 * Single source of truth for attendance "days".
 *
 * BUG HISTORY: attendance was written by three different code paths using three
 * different conventions — the student gate flow stored *local* midnight, the
 * admin upserts stored *UTC* midnight, and the owner list compared against UTC
 * midnight. Because the unique key is `(propertyId, userId, date)`, one real day
 * produced two rows (18:30Z vs 00:00Z) and the owner's `?date=` filter silently
 * missed the gate-written row.
 *
 * CONVENTION (used by every reader and writer now):
 *   `Attendance.date` is always **UTC midnight of the property-local day**.
 * The property-local day is computed in the business timezone (IST, UTC+5:30),
 * because gate movements and curfew are walls-clock facts of the PG, not UTC.
 */

/** Business timezone offset for gate/attendance records: IST (UTC+5:30). */
export const BUSINESS_TZ_OFFSET_MINUTES = 330;

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;

/** First moment of the late-return window that spills past midnight (05:00 local). */
const EARLY_MORNING_CUTOFF_MINUTES = 5 * 60;

/** `YYYY-MM-DD` for the business-local day containing `value`. */
export function dayKey(value: Date | string, offsetMinutes: number = BUSINESS_TZ_OFFSET_MINUTES): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() + offsetMinutes * MS_PER_MINUTE).toISOString().slice(0, 10);
}

/** The canonical `Attendance.date` value for the business-local day of `value`. */
export function attendanceDate(value: Date | string = new Date(), offsetMinutes?: number): Date {
  const key = dayKey(value, offsetMinutes);
  if (!key) throw new Error('Invalid date passed to attendanceDate');
  return new Date(`${key}T00:00:00.000Z`);
}

/** Normalises an incoming `YYYY-MM-DD` (or ISO) string to the canonical day. */
export function attendanceDateFromKey(value: string): Date {
  const key = dayKey(value);
  if (!key) throw new Error('Invalid date passed to attendanceDateFromKey');
  return new Date(`${key}T00:00:00.000Z`);
}

/**
 * Half-open UTC range `[gte, lt)` covering one business-local day, for querying a
 * raw timestamp column (e.g. `GateLog.timestamp`) that was not normalised.
 */
export function dayRangeUtc(dayKeyValue: string): { gte: Date; lt: Date } {
  const start = new Date(`${dayKeyValue}T00:00:00.000Z`);
  return { gte: start, lt: new Date(start.getTime() + MS_PER_DAY) };
}

/** Half-open UTC range `[gte, lt)` covering the business-local month `YYYY-MM`. */
export function monthRangeUtc(month: string): { gte: Date; lt: Date } | null {
  const [yearRaw, monthRaw] = month.split('-');
  const year = Number(yearRaw);
  const monthIndex = Number(monthRaw);
  if (!Number.isInteger(year) || !Number.isInteger(monthIndex) || monthIndex < 1 || monthIndex > 12) return null;

  const start = new Date(`${year}-${String(monthIndex).padStart(2, '0')}-01T00:00:00.000Z`);
  const nextMonth = monthIndex === 12 ? { year: year + 1, month: 1 } : { year, month: monthIndex + 1 };
  const end = new Date(`${nextMonth.year}-${String(nextMonth.month).padStart(2, '0')}-01T00:00:00.000Z`);
  return { gte: start, lt: end };
}

/** Minutes elapsed since local midnight, in the business timezone. */
export function minutesSinceMidnight(value: Date, offsetMinutes: number = BUSINESS_TZ_OFFSET_MINUTES): number {
  const shifted = new Date(value.getTime() + offsetMinutes * MS_PER_MINUTE);
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
}

/**
 * Parses a curfew such as `22:00`, `22:30`, `10:00 PM` or `9:30 pm` into minutes
 * since midnight. Returns `null` when the value cannot be understood.
 */
export function parseCurfewMinutes(curfew: string | null | undefined): number | null {
  if (!curfew || typeof curfew !== 'string') return null;

  const match = /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i.exec(curfew.trim());
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toLowerCase();
  if (minutes > 59) return null;

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (meridiem === 'pm' && hours !== 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
  } else if (hours > 23) {
    return null;
  }

  return hours * 60 + minutes;
}

/** Default curfew when a property has none configured, matching the schema default. */
export const DEFAULT_CURFEW = '22:00';

/**
 * Whether an ENTRY at `value` counts as a late return for this property curfew.
 * Movements between midnight and 05:00 are still "late" for the previous night.
 */
export function isLateEntry(value: Date, curfew: string | null | undefined): boolean {
  const curfewMinutes = parseCurfewMinutes(curfew ?? DEFAULT_CURFEW) ?? parseCurfewMinutes(DEFAULT_CURFEW)!;
  const minutes = minutesSinceMidnight(value);
  return minutes >= curfewMinutes || minutes < EARLY_MORNING_CUTOFF_MINUTES;
}

/**
 * Kills duplicate gate logs from a double-tapped button or a re-scan: two
 * movements of the same type within this window are treated as one.
 */
export const DUPLICATE_GATE_LOG_WINDOW_MS = 60_000;
