// RESPONSIBILITY: Business logic + state for the Student Profile screen.
// DATA FLOW: PUT /api/v1/student/profile -> useStudentProfile -> StudentProfileMain
// The payload keys mirror the backend TenantProfile columns exactly; unknown keys
// are silently dropped by Prisma, so a mismatch here would fake a successful save.

'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { studentOperationsApi } from '@/app/student/student_lib/student_api/StudentOperations';
import { useStudentContext } from '@/app/student/student_components/StudentContext';

export interface ProfileFormData {
  emergencyContactName: string;
  emergencyContactPhone: string;
  permanentAddress: string;
  collegeOrCompany: string;
}

export function useStudentProfile() {
  const { profile, refetch } = useStudentContext();
  const [formData, setFormData] = useState<ProfileFormData>({
    emergencyContactName: '',
    emergencyContactPhone: '',
    permanentAddress: '',
    collegeOrCompany: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFormData({
      emergencyContactName: profile.emergencyContactName || '',
      emergencyContactPhone: profile.emergencyContactPhone || '',
      permanentAddress: profile.permanentAddress || '',
      collegeOrCompany: profile.collegeOrCompany || '',
    });
  }, [profile]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<boolean> => {
      e.preventDefault();
      if (!profile) return false;
      if (!formData.emergencyContactName.trim() || !formData.emergencyContactPhone.trim()) {
        toast.error('Emergency contact name and phone are required.');
        return false;
      }
      setSaving(true);
      try {
        await studentOperationsApi.updateProfile({
          emergencyContactName: formData.emergencyContactName.trim(),
          emergencyContactPhone: formData.emergencyContactPhone.trim(),
          permanentAddress: formData.permanentAddress.trim(),
          collegeOrCompany: formData.collegeOrCompany.trim(),
        });
        await refetch();
        toast.success('Profile updated successfully.');
        return true;
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to update profile.');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [profile, formData, refetch]
  );

  return { profile, formData, setFormData, handleSubmit, saving };
}
