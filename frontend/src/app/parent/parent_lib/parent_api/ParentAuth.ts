import { apiUrl, warnIfApiBaseUnconfigured } from '@/lib/config/apiBase';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: string }) {
    warnIfApiBaseUnconfigured();
    try {
      const res = await fetch(apiUrl('/api/v1/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          password, 
          expectedRole: (expectedRole || 'PARENT').toUpperCase() 
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      const { accessToken, refreshToken, user } = data.data;

      const sessionUser = {
        id: user.id,
        role: user.role.toLowerCase(),
        name: user.fullName || user.name,
        email: user.email,
        ownerId: user.ownerId,
        mustChangePassword: user.mustChangePassword
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionUser));
        localStorage.setItem('spg_current_session', JSON.stringify(sessionUser));
      }

      return sessionUser;
    } catch (e: any) {
      console.error('[ParentAuth] Login failed:', e);
      throw new Error(e.message || 'Authentication error');
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('spg_current_session');
    }
  },

  currentUser(): any | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('spg_current_session');
    return data ? JSON.parse(data) : null;
  },

  async changePassword(_userId: string, newPassword: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(apiUrl('/api/v1/auth/change-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to change password');
    return json.data;
  }
};
