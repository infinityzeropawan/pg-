// RESPONSIBILITY: Provides business logic and state management for the Student Profile.
// DATA FLOW: API -> useStudentProfile -> StudentProfileMain

import { useState, useEffect } from 'react';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { getSession } from '@/app/student/student_lib/student_auth/StudentSession';

export function useStudentProfile() {
  const { profile } = useStudentContext();
  const session = typeof window !== 'undefined' ? getSession() : null;
  const [formData, setFormData] = useState({ phone: '', parentName: '', parentPhone: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        phone: (profile as any).user?.phone || '',
        parentName: (profile as any).parentName || '',
        parentPhone: (profile as any).parentPhone || ''
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !session) return;
    studentOperationsApi.updateProfile((profile as any).id, formData, session.id);
    alert('Profile updated successfully.');
    window.location.reload();
  };

  return {
    profile,
    session,
    formData,
    setFormData,
    handleSubmit
  };
}
