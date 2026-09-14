/**
 * RESPONSIBILITY: Backend-wired API client for the Parent Portal.
 * All calls go to /api/v1/parent/* REST endpoints.
 * Falls back gracefully when the backend is unavailable.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiGet<T = any>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: getAuthHeaders() });
    const json = await res.json();
    if (json.success) return json.data as T;
    return null;
  } catch (e) {
    console.error(`[ParentAPI] GET ${path} failed:`, e);
    return null;
  }
}

async function apiPost<T = any>(path: string, body?: any): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (json.success) return json.data as T;
    throw new Error(json.message || 'Request failed');
  } catch (e) {
    console.error(`[ParentAPI] POST ${path} failed:`, e);
    throw e;
  }
}

export const parentOperationsApi = {
  // ── Dashboard ───────────────────────────────────────────────
  getDashboard: async () => apiGet('/api/v1/parent/dashboard'),

  // ── Profile ─────────────────────────────────────────────────
  getProfile: async () => apiGet('/api/v1/parent/profile'),
  updateProfile: async (data: { relation?: string; address?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/parent/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return json.success ? json.data : null;
    } catch (e) {
      console.error('[ParentAPI] PUT /profile failed:', e);
      return null;
    }
  },

  // ── Child's Gate Logs / Attendance ──────────────────────────
  getGateLogs: async () => apiGet('/api/v1/parent/gate-logs') ?? [],
  
  // Legacy alias used in old ParentDashboardMain
  getChildGateLogs: async (_studentId?: string) =>
    (await apiGet<any[]>('/api/v1/parent/gate-logs')) ?? [],

  // ── Finance ─────────────────────────────────────────────────
  getInvoices: async () => apiGet('/api/v1/parent/invoices') ?? [],
  
  // Legacy alias
  getChildInvoices: async (_studentId?: string) =>
    (await apiGet<any[]>('/api/v1/parent/invoices')) ?? [],

  payInvoice: async (invoiceId: string, paymentMethod = 'UPI') =>
    apiPost(`/api/v1/parent/invoices/${invoiceId}/pay`, { paymentMethod }),

  // ── Complaints ──────────────────────────────────────────────
  getComplaints: async () => apiGet('/api/v1/parent/complaints') ?? [],
  
  // Legacy alias
  getChildComplaints: async (_studentId?: string) =>
    (await apiGet<any[]>('/api/v1/parent/complaints')) ?? [],

  // ── Safety Alerts ───────────────────────────────────────────
  getAlerts: async () => apiGet('/api/v1/parent/alerts') ?? [],
  
  // Legacy alias used in old alerts components
  getChildAlerts: async (_studentId?: string) =>
    (await apiGet<any[]>('/api/v1/parent/alerts')) ?? [],

  // ── Notifications ───────────────────────────────────────────
  getNotifications: async () => apiGet('/api/v1/parent/notifications') ?? [],

  // ── Linked Child Info (from dashboard) ──────────────────────
  // This is not a separate endpoint — we pull from /dashboard
  getLinkedChild: async (_parentId?: string) => {
    const data = await apiGet<any>('/api/v1/parent/dashboard');
    return data?.student ?? null;
  },

  // Legacy: wallet balance — Parents don't have a direct wallet endpoint,
  // but we expose the mess wallet balance from the dashboard student data.
  getWalletBalance: async (_studentId?: string) => {
    const data = await apiGet<any>('/api/v1/parent/dashboard');
    return data?.messWalletBalance ?? 0;
  },
};
