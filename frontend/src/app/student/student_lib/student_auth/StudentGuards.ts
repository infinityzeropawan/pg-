import { getSession } from '@/app/student/student_lib/student_auth/StudentSession';

import type { Role } from '@/lib/types/models';

export function requireRole(expectedRole: Role) {
  const session = getSession();
  if (!session) return false;
  return session.role === expectedRole;
}
