import { authApi as loginAuthApi } from '@/app/login/login_lib/login_api/LoginAuth';

import type { SessionUser } from '@/lib/types';
import type { Role } from '@/lib/types';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: Role }) {
    // Delegates to the shared login client, which authenticates against the backend.
    return await loginAuthApi.login({ email, password, expectedRole: expectedRole || 'manager' });
  },
  logout() {
    loginAuthApi.logout();
  },
  currentUser(): SessionUser | null {
    return loginAuthApi.currentUser();
  },
  async changePassword(userId: string, newPassword: string, oldPassword?: string) {
    return loginAuthApi.changePassword(userId, newPassword, oldPassword);
  }
};