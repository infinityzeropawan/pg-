import { superadminRequest } from './SuperadminClient';

export const superadminOwnersApi = {
  list: () => superadminRequest<any[]>('/owners'),
  get: (id: string) => superadminRequest<any>(`/owners/${id}`),
  create: (data: Record<string, unknown>) => superadminRequest<any>('/owners', { method: 'POST', body: JSON.stringify(data) }),
  setSuspended: (id: string, isSuspended: boolean) => superadminRequest<any>(`/owners/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isSuspended }) }),
  resetPassword: (id: string, newPassword: string) => superadminRequest<any>(`/owners/${id}/reset-password`, { method: 'POST', body: JSON.stringify({ newPassword }) }),
  addNote: (id: string, note: string) => superadminRequest<any>(`/owners/${id}/notes`, { method: 'POST', body: JSON.stringify({ note }) }),
};
