/**
 * API Client Configuration for ABHAYVERSE
 * 
 * NOTE: The frontend currently operates completely in local/mock mode.
 * No real server exists yet; do NOT initiate network requests to nonexistent endpoints.
 * 
 * When you develop the backend, set VITE_API_BASE_URL in a .env file and swap the
 * mock service providers in src/services/portfolioService.ts and src/features/nova/novaService.ts.
 */

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs: number;
  headers: Record<string, string>;
  isMockMode: boolean;
}

export const API_CONFIG: ApiClientConfig = {
  baseUrl: (import.meta.env.VITE_API_BASE_URL as string) || '/api',
  timeoutMs: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Active frontend mode: Mock service active, no external server calls.
  isMockMode: true,
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
