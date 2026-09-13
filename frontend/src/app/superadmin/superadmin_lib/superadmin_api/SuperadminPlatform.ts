import { superadminRequest } from './SuperadminClient';

export const platformApi = {
  getDashboardStats: () => superadminRequest<Record<string, unknown>>('/dashboard'),
  getAnalytics: () => superadminRequest<Record<string, unknown>>('/analytics'),
  createBroadcast: (message: string) => superadminRequest('/broadcasts', { method: 'POST', body: JSON.stringify({ message }) }),
};
