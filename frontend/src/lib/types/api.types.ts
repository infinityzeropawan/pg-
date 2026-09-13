export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: PaginationMeta;
  error?: string;
  statusCode?: number;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'error';
