// DATA FLOW: localStorage → useState → component
// [SHARED HOOK] useManagerSession
// Responsibility: Returns the authenticated manager session from localStorage in an SSR-safe way.
// The user is stored in state and populated via useEffect to prevent hydration mismatches.
'use client';
import { useState, useEffect } from 'react';

import { getSession } from '@/app/manager/manager_lib/manager_auth/ManagerSession';

import type { SessionUser } from '@/lib/types';

/**
 * Returns the current manager session user.
 * Safe to call in both server and client components.
 * Returns null until the client has mounted and localStorage is available.
 */
export function useManagerSession(): SessionUser | null {
  const [user, setUser] = useState<SessionUser | null>(null);
  // Load session client-side only — localStorage is not available during SSR.
  useEffect(() => {
    setUser(getSession());
  }, []);
  return user;
}
