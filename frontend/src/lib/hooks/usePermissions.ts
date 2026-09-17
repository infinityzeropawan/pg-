import { useMemo } from 'react';

import { STORAGE_KEYS } from '@/lib/storage/keys';

import type { SessionUser } from '@/lib/types/models';

type Role = 'owner' | 'manager' | 'staff' | 'student' | 'parent' | 'superadmin';

/** Read the signed-in user's role from the session that auth already stores. */
function readSessionRole(): Role | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as SessionUser;
    return (user?.role as Role) || null;
  } catch {
    return null;
  }
}

/**
 * usePermissions
 * Role gate backed by the real session (previously hardcoded to 'owner').
 * Feature/plan gating is handled separately by `useFeatures`.
 */
export function usePermissions(requiredRole?: Role, requiredRoles?: Role[]) {
  const role = readSessionRole();

  const hasAccess = useMemo(() => {
    if (!requiredRole && (!requiredRoles || requiredRoles.length === 0)) return true;
    if (!role) return false;
    // SuperAdmin can access every role-scoped screen.
    if (role === 'superadmin') return true;
    if (requiredRole) return role === requiredRole;
    return Boolean(requiredRoles?.includes(role));
  }, [role, requiredRole, requiredRoles]);

  return { hasAccess, role };
}

