import { STORAGE_KEYS } from '@/lib/storage/keys';
import { apiUrl } from '@/lib/config/apiBase';
import type { SessionUser, Role } from '@/lib/types/models';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: Role }) {
    try {
      const response = await fetch(apiUrl('/api/v1/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          password, 
          expectedRole: expectedRole ? expectedRole.toUpperCase() : undefined 
        }),
      });

      const responseText = await response.text();
      let resData: any = {};
      try {
        resData = JSON.parse(responseText);
      } catch {
        throw new Error(responseText.substring(0, 150) || 'Server returned invalid response');
      }

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || resData.error?.message || 'Authentication failed');
      }

      const rawUser = resData.data.user;
      const sessionUser: SessionUser = {
        id: rawUser.id,
        role: rawUser.role.toLowerCase() as Role,
        name: rawUser.name || rawUser.fullName,
        email: rawUser.email,
        ownerId: rawUser.ownerId,
        propertyId: rawUser.propertyId,
        assignedPropertyIds: rawUser.assignedPropertyIds,
        mustChangePassword: rawUser.mustChangePassword,
        isDemo: rawUser.isDemo,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionUser));
        localStorage.setItem('spg_current_session', JSON.stringify(sessionUser));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, resData.data.accessToken);
        localStorage.setItem('access_token', resData.data.accessToken);
        if (resData.data.refreshToken) localStorage.setItem('refresh_token', resData.data.refreshToken);
      }

      return sessionUser;
    } catch (backendErr: any) {
      // Authentication must go through the backend. The previous localStorage
      // credential fallback compared plaintext passwords and allowed an offline
      // auth bypass against the cached `spg_users` list, so it was removed.
      console.warn('Backend login failed:', backendErr.message);
      throw new Error(backendErr.message || 'Authentication failed');
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      localStorage.removeItem('spg_current_session');
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  currentUser(): SessionUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION) || localStorage.getItem('spg_current_session');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Changes the password through the backend so the bcrypt hash in Postgres is
   * actually updated. This replaces the previous localStorage-only implementation,
   * which reported success even when the user was not found and never persisted
   * anything — leaving the original/temporary password valid indefinitely.
   */
  async changePassword(_userId: string, newPassword: string, oldPassword?: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;
    const res = await fetch(apiUrl('/api/v1/auth/change-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ newPassword, oldPassword }),
    });

    const text = await res.text();
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(text || 'Failed to change password');
    }
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to change password');
    }

    // Only reflect the change locally once the server has confirmed it.
    const currentSession = this.currentUser();
    if (currentSession) {
      currentSession.mustChangePassword = false;
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(currentSession));
      localStorage.setItem('spg_current_session', JSON.stringify(currentSession));
    }

    return json.data;
  }
};
