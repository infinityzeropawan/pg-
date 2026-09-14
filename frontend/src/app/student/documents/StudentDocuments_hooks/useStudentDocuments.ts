// RESPONSIBILITY: Business logic + state for the Student Documents screen.
// DATA FLOW: GET /student/documents -> useStudentDocuments -> StudentDocumentsMain

'use client';

import { useCallback, useEffect, useState } from 'react';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import type {
  StudentDocumentRecord,
  StudentRentAgreement,
} from '@/app/student/student_lib/student_api/StudentTypes';
import { useStudentContext } from '@/app/student/student_components/StudentContext';

export interface UseStudentDocumentsResult {
  documents: StudentDocumentRecord[];
  agreements: StudentRentAgreement[];
  /** House rules text stored on the resident's property record (nullable). */
  rules: string | null;
  propertyName: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStudentDocuments(): UseStudentDocumentsResult {
  const { profile } = useStudentContext();
  const [documents, setDocuments] = useState<StudentDocumentRecord[]>([]);
  const [agreements, setAgreements] = useState<StudentRentAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!profile) {
      setDocuments([]);
      setAgreements([]);
      setRules(null);
      setPropertyName(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [data, room] = await Promise.all([
        studentOperationsApi.getDocuments(),
        studentOperationsApi.getRoomDetails().catch(() => null),
      ]);
      setDocuments(Array.isArray((data as any)?.documents) ? (data as any).documents : []);
      setAgreements(Array.isArray((data as any)?.agreements) ? (data as any).agreements : []);
      setRules((room as any)?.property?.rules ?? null);
      setPropertyName((room as any)?.property?.name ?? null);
    } catch (e: unknown) {
      console.error('[useStudentDocuments] Failed to load documents:', e);
      setDocuments([]);
      setAgreements([]);
      setRules(null);
      setPropertyName(null);
      setError(e instanceof Error ? e.message : 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    void load();
  }, [load]);

  return { documents, agreements, rules, propertyName, loading, error, refetch: load };
}
