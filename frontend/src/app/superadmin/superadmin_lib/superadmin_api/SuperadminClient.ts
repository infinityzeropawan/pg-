import { apiUrl, warnIfApiBaseUnconfigured } from '@/lib/config/apiBase';
import { STORAGE_KEYS } from '@/lib/storage/keys';

type ApiEnvelope<T> = { success: boolean; message?: string; data: T };

export async function superadminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  warnIfApiBaseUnconfigured();
  const token = typeof window === 'undefined' ? null : localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const response = await fetch(apiUrl(`/api/v1/superadmin${path}`), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || !payload?.success) throw new Error(payload?.message || 'Unable to complete this request');
  return payload.data;
}
