import { apiUrl, warnIfApiBaseUnconfigured } from '@/lib/config/apiBase';
import { STORAGE_KEYS } from '@/lib/storage/keys';

type ApiEnvelope<T> = { success: boolean; message?: string; data: T };

/** Resolves the bearer token written by the login flows. */
function authToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('access_token');
}

function jsonHeaders(): Record<string, string> {
  const token = authToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Issues an admin-scoped request and returns the raw envelope.
 * Paths are relative to `/api/v1/admin` (e.g. `adminRequest('/dashboard')`).
 */
async function adminRequestRaw<T>(path: string, options: RequestInit = {}): Promise<ApiEnvelope<T>> {
  warnIfApiBaseUnconfigured();
  const response = await fetch(apiUrl(`/api/v1/admin${path}`), {
    ...options,
    headers: {
      ...jsonHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Unable to complete admin request (${response.status})`);
  }
  return payload;
}

/** Returns the unwrapped `data` payload. Preferred helper for new code. */
export async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const payload = await adminRequestRaw<T>(path, options);
  return payload.data;
}

/**
 * Issues a request and returns the raw envelope.
 * NOTE: unlike `adminRequest`, paths passed here must already include the
 * `/admin` prefix (e.g. `AdminClient.get('/admin/food-menu')`).
 */
async function rawRequest(path: string, options: RequestInit = {}): Promise<{ data: ApiEnvelope<any> }> {
  warnIfApiBaseUnconfigured();
  const response = await fetch(apiUrl(`/api/v1${path}`), {
    ...options,
    headers: {
      ...jsonHeaders(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const payload = await response.json().catch(() => null) as ApiEnvelope<any> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }
  return { data: payload };
}

export const AdminClient = {
  get: (path: string) => rawRequest(path),
  post: (path: string, body?: any) => rawRequest(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path: string, body?: any) => rawRequest(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put: (path: string, body?: any) => rawRequest(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => rawRequest(path, { method: 'DELETE' }),
};

