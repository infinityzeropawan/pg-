// RESPONSIBILITY: Business logic + state for the Student Visitors screen.
// DATA FLOW: GET /student/visitors, POST /student/visitors, PATCH /student/visitors/:id/checkout
//            -> useStudentVisitors -> StudentVisitorsMain

'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { normalizeVisitors, type StudentVisitor } from '@/app/student/student_lib/student_api/StudentTypes';
import { useStudentContext } from '@/app/student/student_components/StudentContext';

export interface UseStudentVisitorsResult {
  visitors: StudentVisitor[];
  activeVisitors: StudentVisitor[];
  pastVisitors: StudentVisitor[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  addVisitor: (data: { visitorName: string; visitorPhone: string; purpose: string }) => Promise<void>;
  checkOutVisitor: (visitorLogId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useStudentVisitors(): UseStudentVisitorsResult {
  const { profile } = useStudentContext();
  const [visitors, setVisitors] = useState<StudentVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!profile) {
      setVisitors([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await studentOperationsApi.getVisitors();
      const normalized = normalizeVisitors(data);
      setVisitors(normalized);
    } catch (e: unknown) {
      console.error('[useStudentVisitors] Failed to load visitors:', e);
      setVisitors([]);
      setError(e instanceof Error ? e.message : 'Failed to load visitor records.');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    void load();
  }, [load]);

  const addVisitor = useCallback(
    async (data: { visitorName: string; visitorPhone: string; purpose: string }) => {
      if (!profile) return;
      setSubmitting(true);
      try {
        await studentOperationsApi.addVisitor(data);
        toast.success('Visitor request submitted successfully!');
        await load();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to add visitor.');
      } finally {
        setSubmitting(false);
      }
    },
    [profile, load]
  );

  const checkOutVisitor = useCallback(
    async (visitorLogId: string) => {
      try {
        await studentOperationsApi.checkOutVisitor(visitorLogId);
        toast.success('Visitor checked out.');
        await load();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to check out visitor.');
      }
    },
    [load]
  );

  const activeVisitors = visitors.filter((v) => !v.checkOutTime);
  const pastVisitors = visitors.filter((v) => v.checkOutTime);

  return {
    visitors,
    activeVisitors,
    pastVisitors,
    loading,
    submitting,
    error,
    addVisitor,
    checkOutVisitor,
    refetch: load,
  };
}
