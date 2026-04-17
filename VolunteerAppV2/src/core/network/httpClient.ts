/**
 * httpClient.ts
 * -----------------------------------------------------------------------------
 * Centralized HTTP client for all network requests in the application.
 *
 * Purpose:
 * - Provides a single, consistent Axios instance for all API calls.
 * - Handles authentication token injection, rotation, and expiration checks.
 * - Serializes token writes to prevent race conditions.
 * - Centralizes error normalization and global authentication failure handling.
 * - Emits global events for session state changes (e.g., on 401 Unauthorized).
 *
 * High-Level Flow:
 * 1. Outgoing requests automatically attach the latest valid JWT (from memory or secure storage).
 * 2. Before sending, the client checks token expiration using jwt-decode.
 * 3. Incoming responses are checked for rotated tokens in headers and persist them if present.
 * 4. 401 Unauthorized responses trigger a global logout/session clear event.
 * 5. All errors are normalized for consistent handling in repositories and hooks.
 *
 * This file is a critical part of the authentication and session management architecture.
 * It ensures that all network requests are secure, consistent, and robust against edge cases.
 */

// -----------------------------
// Dependency Imports & Purpose
// -----------------------------

/**
 * Axios: Popular HTTP client for browser and Node.js.
 * - Used for all network requests.
 * - Chosen for its interceptors, error handling, and promise-based API.
 */
import axios from 'axios';

/**
 * jwt-decode: Decodes JWT tokens without verifying signature.
 * - Used here to extract the 'exp' (expiration) claim from JWTs.
 * - Allows client-side pre-check of token validity before sending requests.
 * - Does NOT validate the token's authenticity (server remains source of truth).
 */
import { jwtDecode } from 'jwt-decode';

/**
 * runtimeTokenCache: In-memory cache for the current JWT.
 * - Fast access to the token during app runtime.
 * - Cleared on logout or token expiration.
 * - Used before falling back to secure storage.
 */
import * as runtimeTokenCache from '../auth/runtimeTokenCache';

/**
 * secureTokenStore: Secure, persistent storage for JWTs.
 * - Uses Expo SecureStore for device-level security.
 * - Used to persist tokens across app restarts.
 * - Read on cold start or when memory cache is empty.
 */
import * as secureTokenStore from '../auth/secureTokenStore';

/**
 * authEvents: Lightweight event bus for authentication state changes.
 * - Used to emit 'auth:failure' events on global logout/session clear.
 * - Listened to by session state providers and other auth-aware components.
 */
import { authEvents } from '../auth/authEvents';

/**
 * API_BASE_URL: Environment-specific base URL for all API requests.
 * - Ensures all requests are routed to the correct backend.
 */
import { API_BASE_URL } from '../config/env';
// -----------------------------
// Section: Token Write Serialization
// -----------------------------
/**
 * Serializes token writes to prevent race conditions.
 * - Multiple requests may receive rotated tokens simultaneously.
 * - This chain ensures that only the latest token is persisted.
 * - Prevents older tokens from overwriting newer ones.
 */
let tokenWritePromise: Promise<void> = Promise.resolve();

/**
 * Appends a token write to the serialization chain.
 * - Sets the in-memory cache first for immediate use.
 * - Persists to secure storage for durability.
 * - Errors are caught to keep the chain alive.
 */
async function persistNewToken(newToken: string): Promise<void> {
  const writeLink = tokenWritePromise.then(async () => {
    runtimeTokenCache.set(newToken);
    await secureTokenStore.setToken(newToken);
  });
  // Swallow errors to keep the chain alive.
  tokenWritePromise = writeLink.catch(() => {});
  return writeLink;
}

// -----------------------------
// Section: Auth Failure Guard
// -----------------------------
/**
 * Prevents duplicate handling of authentication failures.
 * - Ensures that logout/session clear logic only runs once per failure event.
 * - Important when multiple requests fail with 401 simultaneously.
 */
let isHandlingAuthFailure = false;

/**
 * Handles authentication failure (e.g., on 401 Unauthorized).
 * - Clears both in-memory and secure token storage.
 * - Emits a global 'auth:failure' event for session state reset.
 */
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

// -----------------------------
// Section: Rotated Token Extraction
// -----------------------------
/**
 * Extracts a rotated JWT from response headers, if present.
 * - Supports both 'authorization' and 'x-auth-token' headers.
 * - Used to seamlessly update tokens without explicit login.
 * - Returns the new token string or null if not found.
 */
function extractRotatedToken(response: any): string | null {
  // Check for 'authorization' header (Bearer scheme)
  const authHeader = response.headers?.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const stripped = authHeader.slice('Bearer '.length).trim();
    if (stripped.length > 0) return stripped;
  }
  // Fallback to 'x-auth-token' header (legacy or alternate)
  const xAuthToken = response.headers?.['x-auth-token'];
  if (xAuthToken && typeof xAuthToken === 'string' && xAuthToken.trim().length > 0) {
    return xAuthToken.trim();
  }
  return null;
}

// -----------------------------
// Section: Axios Instance Creation
// -----------------------------
/**
 * Creates a configured Axios instance for all API requests.
 * - Sets base URL, timeout, and default headers.
 * - All interceptors are attached to this instance.
 */
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout for all requests
  headers: { 'Content-Type': 'application/json' },
});

// -----------------------------
// Section: Request Interceptor
// -----------------------------
/**
 * Attaches the latest valid JWT to every outgoing request.
 * - Checks in-memory cache first, then secure storage.
 * - Decodes JWT to check expiration before sending.
 * - If expired or invalid, triggers global logout and rejects the request.
 * - Ensures all requests are authenticated if possible.
 */
httpClient.interceptors.request.use(
    async (config) => {
      console.log('[httpClient] request:', config.method, config.url);

      // Try to get token from memory cache first
      let token = runtimeTokenCache.get();
      if (!token) {
        // Fallback to secure storage if cache is empty
        token = await secureTokenStore.getToken();
        if (token) runtimeTokenCache.set(token);
      }

      if (token) {
        try {
          // Decode JWT to check expiration
          const decoded = jwtDecode<{ exp: number }>(token);
          if (decoded.exp && Date.now() / 1000 >= decoded.exp) {
            // Token is expired (client-side check)
            await handleAuthFailure();
            return Promise.reject(new Error('SESSION_EXPIRED'));
          }
        } catch {
          // Token is invalid or malformed
          await handleAuthFailure();
          return Promise.reject(new Error('INVALID_TOKEN'));
        }

        // Attach token to Authorization header
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
);

// -----------------------------
// Section: Response Interceptor
// -----------------------------
/**
 * Handles incoming responses for token rotation and error normalization.
 * - On success: checks for rotated token in headers and persists it.
 * - On error: normalizes error object, handles 401 (logout), and passes up.
 * - Ensures all errors are consistent for repositories/hooks/UI.
 */
httpClient.interceptors.response.use(
    async (response) => {
      // Check for rotated token in response headers
      const rotatedToken = extractRotatedToken(response);
      if (rotatedToken) {
        await persistNewToken(rotatedToken);
      }
      return response;
    },
    async (error) => {
      // Network error (no response received)
      const isNetworkError = !error.response;
      // Timeout error (Axios specific)
      const isTimeout = error.code === 'ECONNABORTED';

      // Extract status and message from response if available
      const status = error.response?.status ?? null;
      let message = 'An unknown error occurred.';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      // Handle 401 Unauthorized (global logout/session clear)
      if (status === 401) {
        await handleAuthFailure();
      }

      // 403 Forbidden: do NOT logout, just pass error up
      // All other errors: normalize and pass up
      return Promise.reject({
        status,
        message,
        isNetworkError,
        isTimeout,
        ...(__DEV__ ? { original: error } : {}),
      });
    }
);

// -----------------------------
// Export the configured HTTP client
// -----------------------------
export default httpClient;
