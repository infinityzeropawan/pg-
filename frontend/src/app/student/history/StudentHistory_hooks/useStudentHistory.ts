// RESPONSIBILITY: Business logic + state for the Student History screen.
// DATA FLOW: GET /api/v1/student/history -> useStudentHistory -> StudentHistoryMain

'use client';

import { useCallback, useEffect, useState } from 'react';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import type { StudentHistoryEntry } from '@/app/student/student_lib/student_api/StudentTypes';

export interface UseStudentHistoryResult {
  timeline: StudentHistoryEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStudentHistory(): UseStudentHistoryResult {
  const { profile } = useStudentContext();
  const [timeline, setTimeline] = useState<StudentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!profile) {
      setTimeline([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await studentOperationsApi.getHistory();
      setTimeline(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      console.error('[useStudentHistory] Failed to load history:', e);
      setTimeline([]);
      setError(e instanceof Error ? e.message : 'Failed to load activity history.');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    void load();
  }, [load]);

  return { timeline, loading, error, refetch: load };
}
