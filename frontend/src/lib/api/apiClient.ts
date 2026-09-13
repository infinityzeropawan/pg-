import { StatusCodes } from 'http-status-codes';

import { env } from '@/config/env';
import { STORAGE_KEYS } from '@/lib/storage/keys';

import type { ApiResponse } from '@/lib/types/api.types';

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${env.NEXT_PUBLIC_API_URL}${endpoint}`;
  
  // Default headers
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  // Mock token injection
  let token = null;
  if (typeof window !== 'undefined') {
    token = window.localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, { ...options, headers });

    // Handle 401 Unauthorized globally
    if (response.status === StatusCodes.UNAUTHORIZED) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        window.location.href = '/login'; // Or appropriate role login
      }
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Session expired. Please login again.');
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(response.status, data.message || 'API request failed');
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Network error or server unreachable');
  }
}
