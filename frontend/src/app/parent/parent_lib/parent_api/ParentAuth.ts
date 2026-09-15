import { STORAGE_KEYS } from '@/lib/storage/keys';
import { db } from '@/lib/storage/db';
import type { User, Role } from '@/lib/types/models';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: string }) {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          password, 
          expectedRole: (expectedRole || 'PARENT').toUpperCase() 
        }),
      });

      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(responseText.substring(0, 150) || 'Server returned invalid response');
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error?.message || 'Authentication failed');
      }

      const { accessToken, refreshToken, user } = data.data;

      const sessionUser = {
        id: user.id,
        role: user.role.toLowerCase() as Role,
        name: user.fullName || user.name,
        email: user.email,
        ownerId: user.ownerId,
        mustChangePassword: user.mustChangePassword,
        isDemo: user.isDemo
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
      console.warn('[ParentAuth] Backend login warning, trying local storage fallback:', e.message);

      // Fallback for local storage / offline dev mode
      const users = db.getAll<User>(STORAGE_KEYS.USERS);
      const user = users.find(u => 
        u.email && 
        u.email.toLowerCase().trim() === email.toLowerCase().trim() && 
        !u.isDeleted && 
        u.status === 'Active'
      );
      
      if (user) {
        if (password && user.password !== password) throw new Error('Invalid password');
        const sessionUser = {
          id: user.id,
          role: user.role.toLowerCase() as Role,
          name: user.name,
          email: user.email,
          ownerId: user.ownerId,
          mustChangePassword: user.mustChangePassword
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionUser));
          localStorage.setItem('spg_current_session', JSON.stringify(sessionUser));
        }
        return sessionUser;
      }

      throw new Error(e.message || 'Authentication error');
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('spg_current_session');
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  },

  currentUser(): any | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('spg_current_session') || localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return data ? JSON.parse(data) : null;
  },

  async changePassword(_userId: string, newPassword: string, oldPassword?: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${BACKEND_URL}/auth/change-password`, {
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
      await fetch(`${BACKEND_URL}/auth/logout`, {
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
