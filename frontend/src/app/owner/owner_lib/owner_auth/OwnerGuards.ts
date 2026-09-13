import { getSession } from '@/app/owner/owner_lib/owner_auth/OwnerSession';

import type { Role } from '@/lib/types';;

export function requireRole(expectedRole: Role) {
  const session = getSession();
  if (!session) return false;
  return session.role === expectedRole;
}
