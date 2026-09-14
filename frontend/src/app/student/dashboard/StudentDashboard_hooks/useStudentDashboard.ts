// RESPONSIBILITY: Provides business logic and state management for the Student Dashboard.
// DATA FLOW: API -> useStudentDashboard -> StudentDashboardMain

import { useState, useEffect } from 'react';

import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';

export function useStudentDashboard() {
  const { profile, loading } = useStudentContext();
  const [menu, setMenu] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (profile) {
      Promise.all([
        studentOperationsApi.getMessData(),
        studentOperationsApi.getNotices(),
      ]).then(([messData, noticeList]) => {
        if (isMounted) {
          setMenu(messData?.menu?.today || null);
          setNotices(Array.isArray(noticeList) ? noticeList.slice(0, 3) : []);
        }
      }).catch(err => {
        console.error('Failed to load dashboard async details:', err);
      });
    }
    return () => { isMounted = false; };
  }, [profile]);

  return {
    profile,
    loading,
    menu,
    notices
  };
}
