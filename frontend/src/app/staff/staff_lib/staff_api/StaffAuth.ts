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
          expectedRole: (expectedRole || 'STAFF').toUpperCase() 
        }),
      });

      const resData = await response.json();
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
        mustChangePassword: rawUser.mustChangePassword
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionUser));
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, resData.data.accessToken);
        localStorage.setItem('access_token', resData.data.accessToken);
        localStorage.setItem('refresh_token', resData.data.refreshToken);
      }

      return sessionUser;
    } catch (backendErr: any) {
      console.warn('Backend login fallback to local storage:', backendErr.message);
      const users = db.getAll<User>(STORAGE_KEYS.USERS);
      const user = users.find(u => u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim() && !u.isDeleted && u.status === 'Active' && (!expectedRole || u.role.toLowerCase() === expectedRole.toLowerCase()));
      
      if (!user) throw backendErr;
      if (password && user.password !== password) throw new Error('Invalid password');

      const sessionUser: any = {
        id: user.id,
        role: user.role.toLowerCase(),
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  },

  currentUser(): SessionUser | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return data ? JSON.parse(data) : null;
  },

  changePassword(userId: string, newPassword: string) {
    const user = db.getById<User>(STORAGE_KEYS.USERS, userId);
    if (!user) throw new Error('User not found');
    db.update<User>(STORAGE_KEYS.USERS, userId, { 
      password: newPassword, 
      mustChangePassword: false 
    });
  }
};
