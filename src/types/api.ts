export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  meta?: ApiMeta;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ApiMeta;
}

export interface ApiError {
  error: string;
  status: number;
  details?: Record<string, string[]>;
}
