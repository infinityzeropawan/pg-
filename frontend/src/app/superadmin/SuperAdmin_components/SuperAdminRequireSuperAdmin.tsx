// RESPONSIBILITY: Renders the SuperAdminRequireSuperAdmin component.
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession } from '@/app/superadmin/superadmin_lib/superadmin_auth/SuperadminSession';

export function SuperAdminRequireSuperAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    try {
      const session = getSession();
      const isLoginPage = pathname?.includes('/superadmin/login');

      if (!session || session.role !== 'superadmin') {
        if (!isLoginPage) {
          router.replace('/superadmin/login');
        } else {
          setAuthorized(true);
        }
        return;
      }

      if (isLoginPage) {
        // If logged in but on login page, redirect away
        const hasMustChange = session.mustChangePassword === true;
        router.replace(hasMustChange ? '/superadmin/first-login' : '/superadmin/dashboard');
        return;
      }
      
      if (session.mustChangePassword === true && !pathname?.includes('/superadmin/first-login')) {
        router.replace('/superadmin/first-login');
        return;
      }
      
      setAuthorized(true);
    } catch (e) {
      console.error('Auth error:', e);
      router.replace('/superadmin/login');
    }
  }, [router, pathname]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page text-primary">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p>Loading SPG Platform...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

