const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

type ApiEnvelope<T> = { success: boolean; message?: string; data: T };

export async function superadminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window === 'undefined' ? null : localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/superadmin${path}`, {
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
