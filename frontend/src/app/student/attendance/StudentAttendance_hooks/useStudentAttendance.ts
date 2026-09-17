// RESPONSIBILITY: Business logic + state for the Student Attendance screen.
// DATA FLOW: GET /api/v1/student/attendance + GET /api/v1/student/gate-attendance
//            -> useStudentAttendance -> StudentAttendanceMain
//
// NOTE: Every number rendered by the attendance screen (calendar cells, attendance
// rate, late-entry count, approved leave count) is derived from these endpoints.
// Nothing on this screen is hardcoded.

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { businessMonthKey } from '@/lib/utils/datetime';
import { extractGateToken } from '@/lib/utils/gateQr';

export type CalendarCellStatus = 'Present' | 'Absent' | 'Leave' | 'Late' | 'Pending' | 'Upcoming';

export interface AttendanceCalendarCell {
  day: number;
  date: string;
  status: CalendarCellStatus;
}

export interface GateLogEntry {
  id: string;
  type: string;
  reason?: string | null;
  destination?: string | null;
  expectedReturnTime?: string | null;
  isLate?: boolean;
  timestamp?: string;
  createdAt: string;
  /** True when a NotificationLog row was persisted for the linked parent account. */
  parentNotified?: boolean;
  /** ISO time the parent notification was actually written, when one was. */
  parentNotifiedAt?: string | null;
  /** Set when the backend collapsed a double tap / re-scan into the existing log. */
  duplicate?: boolean;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  onLeave: number;
  total: number;
  attendanceRate: number;
  lateEntries: number;
  approvedLeaves: number;
  daysInMonth: number;
}

/**
 * Session storage key for a gate pass scanned while logged out.
 *
 * `StudentLayout` sends unauthenticated visitors to `/student/login`, which drops the
 * `?gate=` query — stashing the token means the pass still applies once the resident
 * is back on the attendance screen after signing in.
 */
const PENDING_GATE_TOKEN_KEY = 'spg_pending_student_gate_token';

/** Stashes a poster token so it survives the login redirect. */
export function stashGateToken(token: string): void {
  if (typeof window === 'undefined' || !token) return;
  try {
    window.sessionStorage.setItem(PENDING_GATE_TOKEN_KEY, token);
  } catch {
    // Private browsing / storage disabled — the resident can simply re-scan.
  }
}

export interface UseStudentAttendanceResult {
  logs: GateLogEntry[];
  calendar: AttendanceCalendarCell[];
  stats: AttendanceStats;
  currentStatus: 'INSIDE' | 'OUTSIDE';
  lastActivity: GateLogEntry | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  monthLabel: string;
  refetch: () => Promise<void>;
  /** Signed token read from the scanned gate poster (null until a scan happens). */
  gateToken: string | null;
  /** Registers a decoded QR payload; returns false when it is not a gate poster. */
  applyScannedPayload: (payload: string) => boolean;
  clearGateToken: () => void;
  /** True when a pass scanned before login was restored, so the UI can auto-open. */
  pendingScanRestored: boolean;
  recordGateAttendance: (data: {
    type: 'entry' | 'exit';
    reason: string;
    destination: string;
    expectedReturnTime?: string;
  }) => Promise<GateLogEntry | null>;
}

export function useStudentAttendance(): UseStudentAttendanceResult {
  const { profile } = useStudentContext();

  const [logs, setLogs] = useState<GateLogEntry[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [approvedLeaves, setApprovedLeaves] = useState(0);
  const [lateEntries, setLateEntries] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, absent: 0, onLeave: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gateToken, setGateToken] = useState<string | null>(null);
  const [pendingScanRestored, setPendingScanRestored] = useState(false);

  const now = useMemo(() => new Date(), []);
  // Business-local month key, matching how the backend resolves `?month=`.
  const monthParam = useMemo(() => businessMonthKey(now), [now]);
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

  const load = useCallback(async () => {
    if (!profile) {
      setLogs([]);
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Both datasets are needed: gate logs drive the In/Out table and late flags,
      // attendance records drive the monthly calendar and the attendance rate.
      const [attendanceData, gateLogData, leaveData] = await Promise.all([
        studentOperationsApi.getAttendance(monthParam).catch(() => null),
        studentOperationsApi.getGateLogs().catch(() => []),
        studentOperationsApi.getLeaves().catch(() => []),
      ]);

      const gateLogs = Array.isArray(gateLogData) ? gateLogData : [];
      setLogs(gateLogs as GateLogEntry[]);
      setLateEntries(gateLogs.filter((l: GateLogEntry) => Boolean(l.isLate)).length);

      const attendance = attendanceData as any;
      setRecords(Array.isArray(attendance?.records) ? attendance.records : []);
      setAttendanceSummary({
        present: Number(attendance?.summary?.present ?? 0),
        absent: Number(attendance?.summary?.absent ?? 0),
        onLeave: Number(attendance?.summary?.onLeave ?? 0),
        total: Number(attendance?.summary?.total ?? 0),
      });

      const leaves = Array.isArray(leaveData) ? leaveData : [];
      setApprovedLeaves(leaves.filter((l: any) => String(l.status || '').toUpperCase() === 'APPROVED').length);
    } catch (e: unknown) {
      console.error('[useStudentAttendance] Failed to load attendance:', e);
      setError(e instanceof Error ? e.message : 'Failed to load attendance data.');
    } finally {
      setLoading(false);
    }
  }, [profile, monthParam]);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * Registers the payload the camera decoded (or the `?gate=` deep link). Returns
   * false for any other QR so the scanner keeps looking for a gate poster.
   */
  const applyScannedPayload = useCallback((payload: string) => {
    const token = extractGateToken(payload);
    if (!token) {
      toast.error('That QR code is not a PG gate poster.');
      return false;
    }
    setGateToken(token);
    return true;
  }, []);

  const clearGateToken = useCallback(() => setGateToken(null), []);

  // Restore a pass that was scanned while logged out (the attendance screen stashes
  // it before StudentLayout redirects to /student/login, which drops the query).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let pending: string | null = null;
    try {
      pending = window.sessionStorage.getItem(PENDING_GATE_TOKEN_KEY);
    } catch {
      return; // Storage unavailable — the resident can simply re-scan.
    }
    if (!pending) return;
    try {
      window.sessionStorage.removeItem(PENDING_GATE_TOKEN_KEY);
    } catch {
      // Ignore storage errors; the token is already consumed.
    }
    if (applyScannedPayload(pending)) setPendingScanRestored(true);
  }, [applyScannedPayload]);


  const recordGateAttendance = useCallback(
    async (data: { type: 'entry' | 'exit'; reason: string; destination: string; expectedReturnTime?: string }) => {
      if (!profile) {
        toast.error('You must be logged in to record attendance.');
        return null;
      }
      if (!gateToken) {
        toast.error('Scan the gate QR poster to mark this movement.');
        return null;
      }
      setSubmitting(true);
      try {
        const created = (await studentOperationsApi.recordGateAttendance({
          type: data.type,
          reason: data.reason,
          destination: data.destination || data.reason,
          expectedReturnTime: data.type === 'exit' ? data.expectedReturnTime : undefined,
          gateToken,
        })) as GateLogEntry | null;

        if (created?.duplicate) {
          // The backend collapsed a double tap / immediate re-scan.
          toast.info('This movement was already recorded a moment ago.');
        } else {
          toast.success(
            created?.parentNotified
              ? 'Attendance recorded. Your parents have been notified.'
              : 'Attendance recorded. No parent account is linked yet.'
          );
        }
        await load();
        return created ?? null;
      } catch (e: unknown) {
        console.error('[useStudentAttendance] Failed to record gate attendance:', e);
        toast.error(e instanceof Error ? e.message : 'Failed to record attendance.');
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [profile, load, gateToken]
  );

  // Gate status is derived from the newest log returned by the API (sorted desc).
  const newestLog: GateLogEntry | null = logs.length > 0 ? logs[0] ?? null : null;
  const currentStatus: 'INSIDE' | 'OUTSIDE' =
    newestLog && String(newestLog.type || '').toLowerCase() === 'exit' ? 'OUTSIDE' : 'INSIDE';
  const lastActivity = newestLog;

  // Calendar cells are built from the persisted Attendance rows for the month.
  const calendar = useMemo<AttendanceCalendarCell[]>(() => {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const todayKey = toLocalDateKey(now);
    const byDate = new Map<string, any>();
    records.forEach(r => {
      const key = toLocalDateKey(r.date);
      if (key) byDate.set(key, r);
    });
    const lateDates = new Set(
      logs.filter(l => l.isLate).map(l => toLocalDateKey(l.timestamp || l.createdAt || ''))
    );

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const key = toLocalDateKey(new Date(now.getFullYear(), now.getMonth(), day));
      const record = byDate.get(key);

      let status: CalendarCellStatus;
      if (record) {
        const raw = String(record.status || '').toUpperCase();
        if (lateDates.has(key)) status = 'Late';
        else if (raw === 'PRESENT') status = 'Present';
        else if (raw === 'ABSENT') status = 'Absent';
        else if (raw === 'ON_LEAVE') status = 'Leave';
        else status = 'Present';
      } else if (key > todayKey) {
        status = 'Upcoming';
      } else {
        status = 'Pending';
      }
      return { day, date: key, status };
    });
  }, [records, logs, now]);

  const stats = useMemo<AttendanceStats>(() => {
    const present = attendanceSummary.present;
    const absent = attendanceSummary.absent;
    // Rate is computed over days that actually have a record, so the number stays
    // meaningful early in the month instead of being diluted by future dates.
    const counted = present + absent;
    const attendanceRate = counted > 0 ? Math.round((present / counted) * 100) : 0;
    return {
      present,
      absent,
      onLeave: attendanceSummary.onLeave,
      total: attendanceSummary.total,
      attendanceRate,
      lateEntries,
      approvedLeaves,
      daysInMonth: counted,
    };
  }, [attendanceSummary, lateEntries, approvedLeaves]);

  return {
    logs,
    calendar,
    stats,
    currentStatus,
    lastActivity,
    loading,
    submitting,
    error,
    monthLabel,
    refetch: load,
    gateToken,
    applyScannedPayload,
    clearGateToken,
    pendingScanRestored,
    recordGateAttendance,
  };
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** A date as `YYYY-MM-DD` in the browser's local timezone (not UTC). */
function toLocalDateKey(value: string | Date): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}
