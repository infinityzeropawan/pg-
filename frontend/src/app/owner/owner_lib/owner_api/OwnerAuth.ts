import { authApi as loginAuthApi } from '@/app/login/login_lib/login_api/LoginAuth';
import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';

import type { User } from '@/lib/types/models';
import type { SessionUser } from '@/lib/types';
import type { Role } from '@/lib/types';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: Role }) {
    try {
      return await loginAuthApi.login({ email, password, expectedRole: expectedRole || 'owner' });
    } catch (backendErr: any) {
      const users = db.getAll<User>(STORAGE_KEYS.USERS);
      const user = users.find(u => u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim() && !u.isDeleted && u.status === 'Active' && (!expectedRole || u.role === expectedRole));
      
      if (!user) throw backendErr;
      if (password && user.password !== password) throw new Error('Invalid password');

      const sessionUser: SessionUser = {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        propertyId: user.propertyId,
        ownerId: user.ownerId,
        assignedPropertyIds: user.assignedPropertyIds,
        mustChangePassword: user.mustChangePassword
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionUser));
      }
      
      return sessionUser;
    }
  },

  logout() {
    loginAuthApi.logout();
  },

  currentUser(): SessionUser | null {
    return loginAuthApi.currentUser();
  },

  async changePassword(userId: string, newPassword: string) {
    return loginAuthApi.changePassword(userId, newPassword);
  }
};

