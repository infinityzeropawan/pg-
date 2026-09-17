// RESPONSIBILITY: Business-timezone day helpers for attendance and gate screens.
//
// The backend stores every attendance day in the business timezone (IST) and stamps
// gate logs with their real timestamp. Building "today" with `toISOString()` yields
// the *UTC* date, which is still yesterday between 00:00 and 05:30 IST — that made
// the manager's gate KPIs and the staff register shift a day.

/** Business timezone offset for attendance/gate records: IST (UTC+5:30). */
export const BUSINESS_TZ_OFFSET_MINUTES = 330;

const MS_PER_MINUTE = 60_000;

/** `YYYY-MM-DD` for the business-local day containing `value`. */
export function businessDayKey(value: Date | string = new Date()): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() + BUSINESS_TZ_OFFSET_MINUTES * MS_PER_MINUTE).toISOString().slice(0, 10);
}

/** `YYYY-MM` for the business-local month containing `value`. */
export function businessMonthKey(value: Date | string = new Date()): string {
  return businessDayKey(value).slice(0, 7);
}
