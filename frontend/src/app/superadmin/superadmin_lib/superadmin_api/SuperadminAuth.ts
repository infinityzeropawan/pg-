import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import type { SessionUser, Role, User } from '@/lib/types/models';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: Role }) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
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
      console.warn('Backend login fallback to local storage:', backendErr.message);
      // LocalStorage Fallback for offline dev
      const users = db.getAll<User>(STORAGE_KEYS.USERS);
      const targetRole = expectedRole ? expectedRole.toLowerCase() : 'superadmin';
      const user = users.find(u => 
        u.email && 
        u.email.toLowerCase().trim() === email.toLowerCase().trim() && 
        !u.isDeleted && 
        (!targetRole || u.role.toLowerCase() === targetRole)
      );
      
      if (!user) throw new Error(backendErr.message || 'User not found or invalid credentials');

      const sessionUser: SessionUser = {
        id: user.id,
        role: user.role.toLowerCase() as Role,
        name: user.name,
        email: user.email,
        propertyId: user.propertyId,
        ownerId: user.ownerId,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionUser));
      }
      
      return sessionUser;
    }
  },

  logout() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        fetch(`${BACKEND_URL}/auth/logout`, {
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

  async changePassword(userId: string, newPassword: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      const res = await fetch(`${BACKEND_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to change password');
      return;
    }

    const user = db.getById<User>(STORAGE_KEYS.USERS, userId);
    if (!user) throw new Error('User not found');
    db.update<User>(STORAGE_KEYS.USERS, userId, { password: newPassword });
  }
};
