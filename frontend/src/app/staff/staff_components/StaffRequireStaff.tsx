// RESPONSIBILITY: Renders the StaffRequireStaff component.
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { getSession } from '@/app/staff/staff_lib/staff_auth/StaffSession';

export function StaffRequireStaff({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getSession();
    const isLoginPage = pathname?.includes('/staff/login');

    if (!session || session.role !== 'staff') {
      if (!isLoginPage) {
        router.replace('/staff/login');
      } else {
        setAuthorized(true);
      }
      return;
    }

    if (isLoginPage) {
      router.replace(session.mustChangePassword ? '/staff/first-login' : '/staff/dashboard');
      return;
    }
    
    if (session.mustChangePassword && !pathname?.includes('/staff/first-login')) {
      router.replace('/staff/first-login');
      return;
    }
    
    setAuthorized(true);
  }, [router, pathname]);

  if (!authorized) return <div className="min-h-screen flex items-center justify-center bg-page text-primary">Loading Staff Portal...</div>;
  return <>{children}</>;
}

