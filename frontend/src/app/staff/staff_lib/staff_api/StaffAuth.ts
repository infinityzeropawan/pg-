import { apiUrl } from '@/lib/config/apiBase';
import { STORAGE_KEYS } from '@/lib/storage/keys';

import type { SessionUser, Role } from '@/lib/types/models';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: Role }) {
    // Always authenticates against the backend. The previous localStorage fallback
    // compared plaintext passwords and allowed an offline auth bypass, so it was removed.
    const response = await fetch(apiUrl('/api/v1/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email.trim(), 
        password, 
        expectedRole: (expectedRole || 'STAFF').toUpperCase() 
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
      throw new Error(resData.message || 'Authentication failed');
    }

    const rawUser = resData.data.user;
    const sessionUser = {
      id: rawUser.id,
      role: rawUser.role.toLowerCase(),
      name: rawUser.name,
      email: rawUser.email,
      ownerId: rawUser.ownerId,
      propertyId: rawUser.propertyId,
      assignedPropertyIds: rawUser.assignedPropertyIds,
      mustChangePassword: rawUser.mustChangePassword
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionUser));
      localStorage.setItem('spg_current_session', JSON.stringify(sessionUser));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, resData.data.accessToken);
      localStorage.setItem('access_token', resData.data.accessToken);
      if (resData.data.refreshToken) localStorage.setItem('refresh_token', resData.data.refreshToken);
    }

    return sessionUser;
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
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION) || localStorage.getItem('spg_current_session');
    return data ? JSON.parse(data) : null;
  },

  /**
   * Changes the password through the backend so the real hash is updated.
   * Replaces the localStorage-only implementation, which threw 'User not found'
   * unless a local cache existed and never persisted anything.
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
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to change password');
    return json.data;
  }
};
