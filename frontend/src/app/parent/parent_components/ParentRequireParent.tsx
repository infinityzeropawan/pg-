// RESPONSIBILITY: Renders the ParentRequireParent component.
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { getSession } from '@/app/parent/parent_lib/parent_auth/ParentSession';

export function ParentRequireParent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const session = getSession();
    const isLoginPage = pathname?.includes('/parent/login');

    if (!session || session.role !== 'parent') {
      if (!isLoginPage) {
        router.replace('/parent/login');
      } else {
        setAuthorized(true);
      }
      return;
    }

    if (isLoginPage) {
      router.replace(session.mustChangePassword ? '/parent/first-login' : '/parent/dashboard');
      return;
    }
    
    if (session.mustChangePassword && !pathname?.includes('/parent/first-login')) {
      router.replace('/parent/first-login');
      return;
    }
    
    setAuthorized(true);
  }, [router, pathname]);

  if (!authorized) return <div className="min-h-screen flex items-center justify-center bg-page text-primary">Loading Parent App...</div>;
  return <>{children}</>;
}
