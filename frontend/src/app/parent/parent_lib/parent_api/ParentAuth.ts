import { authApi as loginAuthApi } from '@/app/login/login_lib/login_api/LoginAuth';
import { apiUrl } from '@/lib/config/apiBase';
import type { Role } from '@/lib/types/models';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: string }) {
    return await loginAuthApi.login({ 
      email, 
      password, 
      expectedRole: (expectedRole || 'parent').toLowerCase() as Role 
    });
  },

  logout() {
    loginAuthApi.logout();
  },

  currentUser(): any | null {
    return loginAuthApi.currentUser();
  },

  async changePassword(_userId: string, newPassword: string, oldPassword?: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(apiUrl('/api/v1/auth/change-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword, oldPassword }),
    });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { throw new Error(text || 'Failed to change password'); }
    if (!json.success) throw new Error(json.message || 'Failed to change password');
    return json.data;
  },

  /** Server-side logout (revokes the refresh token) plus local cleanup. */
  async logoutServer() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    try {
      await fetch(apiUrl('/api/v1/auth/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (e) {
      console.warn('[ParentAuth] Server logout warning:', e);
    }
    this.logout();
  }
};
