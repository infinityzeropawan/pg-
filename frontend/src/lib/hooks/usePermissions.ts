import { useMemo } from 'react';

// Mock permissions structure. In a real app, this comes from the auth context/token.
type Role = 'owner' | 'manager' | 'staff' | 'student' | 'superadmin';

/**
 * usePermissions
 * Custom hook for React.
 */
export function usePermissions(requiredRole?: Role, requiredPermissions?: string[]) {
  // Mock current user state
  const currentUserRole: Role = 'owner';
  const currentUserPermissions: string[] = ['create_invoice', 'delete_user'];

  const hasAccess = useMemo(() => {
    let roleMatch = true;
    let permMatch = true;

    if (requiredRole) {
      roleMatch = currentUserRole === requiredRole || (currentUserRole as string) === 'superadmin';
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      permMatch = requiredPermissions.every(perm => currentUserPermissions.includes(perm));
    }

    return roleMatch && permMatch;
  }, [requiredRole, requiredPermissions, currentUserRole, currentUserPermissions]);

  return { hasAccess, role: currentUserRole };
}
