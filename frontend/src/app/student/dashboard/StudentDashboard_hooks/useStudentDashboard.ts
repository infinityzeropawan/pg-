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

  const handleReferralSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    
    const formData = new FormData(e.currentTarget);
    const name = (formData as any).get('name') as string;
    const phone = (formData as any).get('phone') as string;
    
    alert(`Thank you! Referral for ${name} (${phone}) submitted.`);
    (e.target as HTMLFormElement).reset();
  };

  return {
    profile,
    loading,
    menu,
    notices,
    handleReferralSubmit
  };
}
