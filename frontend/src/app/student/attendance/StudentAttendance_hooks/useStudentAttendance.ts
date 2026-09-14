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

  const now = useMemo(() => new Date(), []);
  const monthParam = useMemo(
    () => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    [now]
  );
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

  const recordGateAttendance = useCallback(
    async (data: { type: 'entry' | 'exit'; reason: string; destination: string; expectedReturnTime?: string }) => {
      if (!profile) {
        toast.error('You must be logged in to record attendance.');
        return null;
      }
      setSubmitting(true);
      try {
        const created = await studentOperationsApi.recordGateAttendance({
          type: data.type,
          reason: data.reason,
          destination: data.destination || data.reason,
          expectedReturnTime: data.type === 'exit' ? data.expectedReturnTime : undefined,
        });
        toast.success(
          (created as GateLogEntry | null)?.parentNotified
            ? 'Attendance recorded. Your parents have been notified.'
            : 'Attendance recorded. No parent account is linked yet.'
        );
        await load();
        return (created as GateLogEntry | null) ?? null;
      } catch (e: unknown) {
        console.error('[useStudentAttendance] Failed to record gate attendance:', e);
        toast.error(e instanceof Error ? e.message : 'Failed to record attendance.');
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [profile, load]
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
