// --- Token write serialization ---
let tokenWritePromise: Promise<void> = Promise.resolve();
async function persistNewToken(newToken: string): Promise<void> {
  const writeLink = tokenWritePromise.then(async () => {
    runtimeTokenCache.set(newToken);
    await secureTokenStore.setToken(newToken);
  });
  // Absorb rejection on the shared chain to keep it alive for future writes.
  tokenWritePromise = writeLink.catch(() => {});
  return writeLink;
}

// --- Auth failure guard ---
let isHandlingAuthFailure = false;
async function handleAuthFailure() {
  if (isHandlingAuthFailure) return;
  isHandlingAuthFailure = true;
  try {
    runtimeTokenCache.clear();
    await secureTokenStore.clearToken();
    authEvents.emit('auth:failure');
  } finally {
    isHandlingAuthFailure = false;
  }
}

// --- Only extract rotated token from headers ---
function extractRotatedToken(response: any): string | null {
  const authHeader = response.headers?.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const stripped = authHeader.slice(7).trim();
    if (stripped.length > 0) return stripped;
  }
  const xAuthToken = response.headers?.['x-auth-token'];
  if (xAuthToken && typeof xAuthToken === 'string' && xAuthToken.trim().length > 0) {
    return xAuthToken.trim();
  }
  return null;
}

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach latest Bearer token and pre-flight exp check
httpClient.interceptors.request.use(
    async (config) => {
      console.log('[httpClient] request:', config.method, config.url);
      let token = runtimeTokenCache.get();
      if (!token) {
        token = await secureTokenStore.getToken();
        if (token) runtimeTokenCache.set(token);
      }
      if (token) {
        // Pre-flight exp check (UX only)
        try {
          const { exp } = jwtDecode<{ exp: number }>(token);
          if (exp && Date.now() / 1000 >= exp) {
            await handleAuthFailure();
            return Promise.reject(new Error('SESSION_EXPIRED'));
          }
        } catch {
          await handleAuthFailure();
          return Promise.reject(new Error('INVALID_TOKEN'));
        }
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle token rotation and 401/403
httpClient.interceptors.response.use(
    async (response) => {
      const newToken = extractRotatedToken(response);
      if (newToken) {
        await persistNewToken(newToken);
      }
      return response;
    },
    async (error) => {
      const isNetworkError = !error.response;
      const isTimeout = error.code === 'ECONNABORTED';
      const status = error.response?.status ?? null;
      let message = 'An unknown error occurred.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      if (status === 401) {
        await handleAuthFailure();
      }
      // 403: propagate to caller for UI handling (do not logout)
      return Promise.reject({
        status,
        message,
        isNetworkError,
        isTimeout,
        ...(__DEV__ ? { original: error } : {}),
      });
    }
);

export default httpClient;
// src/core/network/httpClient.ts
// Centralized HTTP client for all API requests with secure JWT handling
import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import * as runtimeTokenCache from '../auth/runtimeTokenCache';
import * as secureTokenStore from '../auth/secureTokenStore';
// Add jwt-decode for exp check
import { jwtDecode } from 'jwt-decode';
import { authEvents } from '../auth/authEvents';
