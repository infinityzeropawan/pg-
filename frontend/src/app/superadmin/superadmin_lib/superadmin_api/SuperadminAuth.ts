import { apiUrl } from '@/lib/config/apiBase';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { SessionUser, Role, User } from '@/lib/types/models';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: Role }) {
    try {
      const response = await fetch(apiUrl('/api/v1/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          password, 
          expectedRole: expectedRole ? expectedRole.toUpperCase() : 'SUPERADMIN' 
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Authentication failed');
      }

      const sessionUser: SessionUser = resData.data.user;

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionUser));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, resData.data.accessToken);
        localStorage.setItem('access_token', resData.data.accessToken);
        localStorage.setItem('refresh_token', resData.data.refreshToken);
      }

      return sessionUser;
    } catch (backendErr: any) {
      // Authentication must go through the backend. The previous localStorage fallback
      // matched cached accounts and allowed an offline auth bypass, so it was removed.
      console.warn('Backend login failed:', backendErr.message);
      throw new Error(backendErr.message || 'User not found or invalid credentials');
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('access_token');
      if (token) {
        fetch(apiUrl('/api/v1/auth/logout'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => {});
      }
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  currentUser(): SessionUser | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Changes the password through the backend. Replaces the localStorage-only branch
   * that silently "succeeded" without a token and never updated the real hash.
   */
  async changePassword(_userId: string, newPassword: string, oldPassword?: string) {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('access_token')
      : null;
    if (!token) throw new Error('You must be signed in to change your password.');

    const res = await fetch(apiUrl('/api/v1/auth/change-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newPassword, oldPassword }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) throw new Error(data?.message || 'Failed to change password');
    return data.data;
  }
};
