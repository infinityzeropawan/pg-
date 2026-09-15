import { db } from '@/lib/storage/db';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { apiUrl } from '@/lib/config/apiBase';
import type { User, SessionUser, Role } from '@/lib/types/models';

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
      console.warn('Backend login notice:', backendErr.message);

      // LocalStorage Fallback for offline dev
      const users = db.getAll<User>(STORAGE_KEYS.USERS);
      const user = users.find(u => 
        u.email && 
        u.email.toLowerCase().trim() === email.toLowerCase().trim() && 
        !u.isDeleted && 
        u.status === 'Active' && 
        (!expectedRole || u.role.toLowerCase() === expectedRole.toLowerCase())
      );
      
      if (user) {
        if (password && user.password !== password) throw new Error('Invalid password');
        const sessionUser: SessionUser = {
          id: user.id,
          role: user.role.toLowerCase() as Role,
          name: user.name,
          email: user.email,
          ownerId: user.ownerId,
          mustChangePassword: user.mustChangePassword,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(sessionUser));
          localStorage.setItem('spg_current_session', JSON.stringify(sessionUser));
        }

        return sessionUser;
      }

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

  async changePassword(userId: string, newPassword: string) {
    const users = db.getAll<User>(STORAGE_KEYS.USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      db.update(STORAGE_KEYS.USERS, userId, { password: newPassword, mustChangePassword: false });
      
      const currentSession = this.currentUser();
      if (currentSession && currentSession.id === userId) {
        currentSession.mustChangePassword = false;
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(currentSession));
        localStorage.setItem('spg_current_session', JSON.stringify(currentSession));
      }
      return true;
    }
    
    return true;
  }
};
