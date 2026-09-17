/**
 * RESPONSIBILITY: Backend-wired API client for Student Portal.
 * All calls go to /api/v1/student/* REST endpoints.
 * Includes legacy signatures for backward compatibility.
 */

import { apiUrl, warnIfApiBaseUnconfigured } from '@/lib/config/apiBase';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiGet<T = any>(path: string): Promise<T | null> {
  warnIfApiBaseUnconfigured();
  try {
    const res = await fetch(apiUrl(path), { headers: getAuthHeaders() });
    const json = await res.json();
    if (json.success) return json.data as T;
    return null;
  } catch (e) {
    console.error(`[StudentAPI] GET ${path} failed:`, e);
    return null;
  }
}

async function apiPost<T = any>(path: string, body?: any): Promise<T | null> {
  warnIfApiBaseUnconfigured();
  try {
    const res = await fetch(apiUrl(path), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (json.success) return json.data as T;
    throw new Error(json.message || 'Request failed');
  } catch (e) {
    console.error(`[StudentAPI] POST ${path} failed:`, e);
    throw e;
  }
}

async function apiPatch<T = any>(path: string, body?: any): Promise<T | null> {
  warnIfApiBaseUnconfigured();
  try {
    const res = await fetch(apiUrl(path), {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (json.success) return json.data as T;
    throw new Error(json.message || 'Request failed');
  } catch (e) {
    console.error(`[StudentAPI] PATCH ${path} failed:`, e);
    throw e;
  }
}

async function apiPut<T = any>(path: string, body?: any): Promise<T | null> {
  warnIfApiBaseUnconfigured();
  try {
    const res = await fetch(apiUrl(path), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (json.success) return json.data as T;
    throw new Error(json.message || 'Request failed');
  } catch (e) {
    console.error(`[StudentAPI] PUT ${path} failed:`, e);
    throw e;
  }
}

export const studentOperationsApi = {
  // ── Profile & Room ───────────────────────────────────────────
  getProfile: async (_userId?: string) => apiGet('/api/v1/student/profile'),
  updateProfile: async (data: any, _legacyData?: any, _userId?: string) => apiPut('/api/v1/student/profile', typeof data === 'string' ? _legacyData : data),
  getRoomDetails: async () => apiGet('/api/v1/student/room'),

  // ── Finance ─────────────────────────────────────────────────
  getInvoices: async (_studentId?: string) => (await apiGet<any[]>('/api/v1/student/invoices')) ?? [],
  getRentHistory: async () => apiGet('/api/v1/student/rent-history'),
  payInvoice: async (invoiceId: string, _studentId?: string | number, paymentMethod = 'UPI', _userId?: string) =>
    apiPost(`/api/v1/student/invoices/${invoiceId}/pay`, { paymentMethod: typeof paymentMethod === 'string' ? paymentMethod : 'UPI' }),

  // ── Mess & Food ─────────────────────────────────────────────
  getMessData: async () => apiGet('/api/v1/student/mess'),
  getWalletBalance: async (_studentId?: string) => {
    const data = await apiGet<any>('/api/v1/student/mess');
    return data?.wallet?.balance ?? 0;
  },
  getTodayMenu: async (_propertyId?: string) => {
    const data = await apiGet<any>('/api/v1/student/mess');
    return data?.menu?.today ?? null;
  },
  rechargeMessWallet: async (amount: number) => apiPost('/api/v1/student/mess/wallet/recharge', { amount }),
  rechargeWallet: async (_studentId: string, amount: number, _userId?: string) =>
    apiPost('/api/v1/student/mess/wallet/recharge', { amount }),
  orderMeal: async (mealType: string, propertyId?: string, _type?: string, _cost?: number, _userId?: string) =>
    apiPost('/api/v1/student/mess/order', { mealType, propertyId }),
  rateMeal: async (orderId: string, rating: number, feedback?: string) =>
    apiPatch(`/api/v1/student/mess/orders/${orderId}/rate`, { rating, feedback }),

  // ── Complaints ──────────────────────────────────────────────
  getComplaints: async (_studentId?: string) => (await apiGet<any[]>('/api/v1/student/complaints')) ?? [],
  createComplaint: async (data: any, _userId?: string) =>
    apiPost('/api/v1/student/complaints', data),

  // ── Notices & Notice Period ─────────────────────────────────
  getNotices: async (_propertyId?: string) => (await apiGet<any[]>('/api/v1/student/notices')) ?? [],
  submitNoticePeriod: async (moveOutDate: string, reason: string) =>
    apiPost('/api/v1/student/notice-period', { moveOutDate, reason }),
  submitNotice: async (_studentId: string, _propertyId: string, moveOutDate: string, reason: string, _userId?: string) =>
    apiPost('/api/v1/student/notice-period', { moveOutDate, reason }),

  // ── Visitors ────────────────────────────────────────────────
  getVisitors: async () => (await apiGet<any[]>('/api/v1/student/visitors')) ?? [],
  addVisitor: async (data: { visitorName: string; visitorPhone: string; purpose: string }) =>
    apiPost('/api/v1/student/visitors', data),
  checkOutVisitor: async (visitorLogId: string) =>
    apiPatch(`/api/v1/student/visitors/${visitorLogId}/checkout`),

  // ── Leave Requests ──────────────────────────────────────────
  getLeaves: async () => (await apiGet<any[]>('/api/v1/student/leaves')) ?? [],
  requestLeave: async (data: { startDate: string; endDate: string; reason: string }) =>
    apiPost('/api/v1/student/leaves', data),
  cancelLeave: async (leaveId: string) =>
    apiPatch(`/api/v1/student/leaves/${leaveId}/cancel`),

  // ── SOS / Safety ────────────────────────────────────────────
  triggerSOS: async (coords?: { latitude?: number; longitude?: number }) =>
    apiPost('/api/v1/student/sos', coords),
  triggerSos: async (_studentId?: string, _propertyId?: string, _userId?: string) =>
    apiPost('/api/v1/student/sos'),
  resolveSOS: async (sosId: string) =>
    apiPatch(`/api/v1/student/sos/${sosId}/resolve`),
  getSOSHistory: async () => (await apiGet<any[]>('/api/v1/student/sos/history')) ?? [],

  // ── Gate Attendance ─────────────────────────────────────────
  // `gateToken` is the signed token read off the printed gate poster; the backend
  // rejects a movement without it, so attendance can only be marked by a real scan.
  recordGateAttendance: async (data: { type: string; reason?: string; destination?: string; expectedReturnTime?: string; gateToken?: string | null }) =>
    apiPost('/api/v1/student/gate-attendance', {
      type: data.type,
      reason: data.reason,
      destination: data.destination,
      expectedReturnTime: data.expectedReturnTime,
      gateToken: data.gateToken ?? undefined,
    }),
  getGateLogs: async (_studentId?: string) => (await apiGet<any[]>('/api/v1/student/gate-attendance')) ?? [],

  // ── Attendance Records ──────────────────────────────────────
  getAttendance: async (month?: string) => apiGet(`/api/v1/student/attendance${month ? `?month=${month}` : ''}`),

  // ── Documents ───────────────────────────────────────────────
  getDocuments: async () => apiGet('/api/v1/student/documents'),

  // ── Notifications ───────────────────────────────────────────
  getNotifications: async () => (await apiGet<any[]>('/api/v1/student/notifications')) ?? [],
  markNotificationRead: async (id: string) => apiPatch(`/api/v1/student/notifications/${id}/read`),

  // ── Activity History ────────────────────────────────────────
  getHistory: async () => (await apiGet<any[]>('/api/v1/student/history')) ?? [],

  // ── Feedback & Support ──────────────────────────────────────
  submitFeedback: async (data: { title: string; description: string; priority?: string }) =>
    apiPost('/api/v1/student/feedback', data),
};
