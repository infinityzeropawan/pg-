// RESPONSIBILITY: Renders the ManagerRequireManager component.
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { getSession } from '@/app/manager/manager_lib/manager_auth/ManagerSession';
export function ManagerRequireManager({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getSession();
    const isLoginPage = pathname?.includes('/manager/login');
    if (!session || session.role !== 'manager') {
      if (!isLoginPage) {
        router.replace('/manager/login');
      } else {
        setAuthorized(true);
      }
      return;
    }
    if (isLoginPage) {
      router.replace(session.mustChangePassword ? '/manager/first-login' : '/manager/dashboard');
      return;
    }
    if (session.mustChangePassword && !pathname?.includes('/manager/first-login')) {
      router.replace('/manager/first-login');
      return;
    }
    setAuthorized(true);
  }, [router, pathname]);
  if (!authorized) return <div className="min-h-screen flex items-center justify-center bg-page text-primary">Loading Manager Portal...</div>;
  return <>{children}</>;
}