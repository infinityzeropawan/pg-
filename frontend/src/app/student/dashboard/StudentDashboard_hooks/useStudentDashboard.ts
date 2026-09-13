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
    if (profile) {
      setMenu(studentOperationsApi.getTodayMenu(profile.propertyId));
      setNotices(studentOperationsApi.getNotices(profile.propertyId).slice(0, 3));
    }
  }, [profile]);

  const handleReferralSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    
    const formData = new FormData(e.currentTarget);
    const name = (formData as any).get('name') as string;
    const phone = (formData as any).get('phone') as string;
    
    import('@/app/student/student_lib/student_api/StudentAuth' as any).then((mod: any) => {
      const api = mod.api || mod.authApi || mod;
      api.managerEnquiries.create({
        propertyId: profile.propertyId,
        name,
        phone,
        referredByStudentId: profile.userId,
        notes: `Referred by existing student: ${profile.user?.name || 'Friend'} (Room: ${profile.roomNumber})`
      });
      alert('Referral submitted successfully! You will get 20% off when they join.');
      (e.target as HTMLFormElement).reset();
    });
  };

  return {
    profile,
    loading,
    menu,
    notices,
    handleReferralSubmit
  };
}
