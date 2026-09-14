// RESPONSIBILITY: Business logic + state for the Student Leaves screen.
// DATA FLOW: GET /student/leaves, POST /student/leaves -> useStudentLeaves -> StudentLeavesMain

'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { normalizeLeaves, type StudentLeave } from '@/app/student/student_lib/student_api/StudentTypes';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { LEAVE_STATUS } from '@/lib/constants/domain';

export interface UseStudentLeavesResult {
  leaves: StudentLeave[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  requestLeave: (data: { startDate: string; endDate: string; reason: string; destination?: string }) => Promise<void>;
  cancelLeave: (leaveId: string) => Promise<void>;
  refetch: () => Promise<void>;
  LEAVE_STATUS: typeof LEAVE_STATUS;
}

export function useStudentLeaves(): UseStudentLeavesResult {
  const { profile } = useStudentContext();
  const [leaves, setLeaves] = useState<StudentLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!profile) {
      setLeaves([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await studentOperationsApi.getLeaves();
      setLeaves(normalizeLeaves(data));
    } catch (e: unknown) {
      console.error('[useStudentLeaves] Failed to load leaves:', e);
      setLeaves([]);
      setError(e instanceof Error ? e.message : 'Failed to load leave requests.');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    void load();
  }, [load]);

  const requestLeave = useCallback(
    async (data: { startDate: string; endDate: string; reason: string; destination?: string }) => {
      if (!profile) return;
      setSubmitting(true);
      try {
        // The API persists a single `reason` column, so the destination (when provided)
        // is stored as part of the reason text instead of being silently dropped.
        const destination = data.destination?.trim();
        const reason = destination ? `Destination: ${destination}. Reason: ${data.reason}` : data.reason;

        await studentOperationsApi.requestLeave({
          startDate: data.startDate,
          endDate: data.endDate,
          reason,
        });
        toast.success('Leave request submitted successfully!');
        await load();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to submit leave request.');
      } finally {
        setSubmitting(false);
      }
    },
    [profile, load]
  );

  const cancelLeave = useCallback(
    async (leaveId: string) => {
      if (!leaveId) return;
      try {
        await studentOperationsApi.cancelLeave(leaveId);
        toast.success('Leave request cancelled.');
        await load();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to cancel leave request.');
      }
    },
    [load]
  );

  return {
    leaves,
    loading,
    submitting,
    error,
    requestLeave,
    cancelLeave,
    refetch: load,
    LEAVE_STATUS,
  };
}
