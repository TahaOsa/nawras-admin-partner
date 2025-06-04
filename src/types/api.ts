// Common API-related TypeScript type definitions

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

// Generic API list response wrapper
export interface ApiListResponse<T = any> {
  success: boolean;
  data: T[];
  total: number;
  page?: number;
  limit?: number;
  timestamp?: string;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// Sorting parameters
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Date range filter
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

// Generic filter parameters
export interface FilterParams extends PaginationParams, SortParams, DateRangeFilter {
  search?: string;
}

// HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API endpoint configuration
export interface ApiEndpoint {
  method: HttpMethod;
  url: string;
  requiresAuth?: boolean;
}

// API error types
export const ApiErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export type ApiErrorTypeType = typeof ApiErrorType[keyof typeof ApiErrorType];

// Detailed API error
export interface ApiError {
  type: ApiErrorTypeType;
  message: string;
  details?: any;
  statusCode?: number;
}
