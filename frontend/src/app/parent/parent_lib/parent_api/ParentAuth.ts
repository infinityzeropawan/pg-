const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const authApi = {
  async login({ email, password, expectedRole }: { email: string; password?: string; expectedRole?: string }) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: expectedRole }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const { accessToken, refreshToken, user } = data.data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('spg_current_session', JSON.stringify({
          id: user.id,
          role: user.role,
          name: user.fullName || user.name,
          email: user.email,
        }));
      }

      return user;
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
    const res = await fetch(`${API_BASE}/api/v1/auth/change-password`, {
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
