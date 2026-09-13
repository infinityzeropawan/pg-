import { getSession } from '@/app/staff/staff_lib/staff_auth/StaffSession';

import type { Role } from '@/lib/types/models';

export function requireRole(expectedRole: Role) {
  const session = getSession();
  if (!session) return false;
  return session.role === expectedRole;
}
