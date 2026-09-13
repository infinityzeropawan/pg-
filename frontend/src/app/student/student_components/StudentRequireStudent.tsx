// RESPONSIBILITY: Renders the StudentRequireStudent component.
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { getSession } from '@/app/student/student_lib/student_auth/StudentSession';

export function StudentRequireStudent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getSession();
    const isLoginPage = pathname?.includes('/student/login');

    if (!session || session.role !== 'student') {
      if (!isLoginPage) {
        router.replace('/student/login');
      } else {
        setAuthorized(true);
      }
      return;
    }

    if (isLoginPage) {
      router.replace(session.mustChangePassword ? '/student/first-login' : '/student/dashboard');
      return;
    }
    
    if (session.mustChangePassword && !pathname?.includes('/student/first-login')) {
      router.replace('/student/first-login');
      return;
    }
    
    setAuthorized(true);
  }, [router, pathname]);

  if (!authorized) return <div className="min-h-screen flex items-center justify-center bg-page text-primary">Loading Student App...</div>;
  return <>{children}</>;
}

