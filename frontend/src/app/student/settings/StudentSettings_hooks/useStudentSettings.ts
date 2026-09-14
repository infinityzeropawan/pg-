// RESPONSIBILITY: Business logic + state for the Student Settings screen.
// DATA FLOW: POST /api/v1/auth/change-password, POST /api/v1/auth/logout
//            -> useStudentSettings -> StudentSettingsMain

'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authApi } from '@/app/student/student_lib/student_api/StudentAuth';
import { useStudentContext } from '@/app/student/student_components/StudentContext';
import { STUDENT_ROUTES } from '@/app/student/student_url_config';

export interface UseStudentSettingsResult {
  profile: any;
  changingPassword: boolean;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export function useStudentSettings(): UseStudentSettingsResult {
  const router = useRouter();
  const { profile } = useStudentContext();
  const [changingPassword, setChangingPassword] = useState(false);

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string): Promise<boolean> => {
      if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters.');
        return false;
      }
      setChangingPassword(true);
      try {
        await authApi.changePassword(profile?.id || '', newPassword, oldPassword || undefined);
        toast.success('Password changed successfully.');
        return true;
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to change password.');
        return false;
      } finally {
        setChangingPassword(false);
      }
    },
    [profile]
  );

  const logout = useCallback(async () => {
    // Revokes the refresh token server-side, then clears the local session.
    await authApi.logoutServer();
    router.push(STUDENT_ROUTES.LOGIN);
  }, [router]);

  return { profile, changingPassword, changePassword, logout };
}
