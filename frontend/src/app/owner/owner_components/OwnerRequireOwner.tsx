'use client';

// RESPONSIBILITY: Guards all owner routes. Redirects to login if no owner session found.
// Calls seedIfNeeded() first so demo session is always present.
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';
import { seedIfNeeded } from '@/app/owner/owner_lib/owner_mock_seed';

export function OwnerRequireOwner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Seed demo data + session before checking auth
    seedIfNeeded();
    const session = getSession();
    const isLoginPage = pathname?.includes('/owner/login');

    if (!session || session.role !== 'owner') {
      if (!isLoginPage) {
        router.replace('/owner/login');
      } else {
        setAuthorized(true);
      }
      return;
    }

    if (isLoginPage) {
      router.replace(session.mustChangePassword ? '/owner/first-login' : '/owner/dashboard');
      return;
    }

    if (session.mustChangePassword && !pathname?.includes('/owner/first-login')) {
      router.replace('/owner/first-login');
      return;
    }

    setAuthorized(true);
  }, [router, pathname]);

  if (!authorized) return <div className="min-h-screen flex items-center justify-center bg-page text-primary">Loading Owner Portal...</div>;
  return <>{children}</>;
}
