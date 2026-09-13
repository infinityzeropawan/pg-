import { getSession } from '@/app/manager/manager_lib/manager_auth/ManagerSession';

import type { Role } from '@/lib/types';;
export function requireRole(expectedRole: Role) {
  const session = getSession();
  if (!session) return false;
  return session.role === expectedRole;
}