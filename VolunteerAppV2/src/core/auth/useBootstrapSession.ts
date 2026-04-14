// src/core/auth/useBootstrapSession.ts
// Hook to bootstrap session state on app start
import { useEffect } from 'react';
import { useSession } from './sessionStore';
import * as secureTokenStore from './secureTokenStore';
import * as runtimeTokenCache from './runtimeTokenCache';
import httpClient from '../network/httpClient';

export function useBootstrapSession() {
  const { setStatus } = useSession();

  useEffect(() => {
    let isMounted = true;
    async function bootstrap() {
      setStatus('bootstrapping');
      const token = await secureTokenStore.getToken();
      if (!token) {
        setStatus('unauthenticated');
        return;
      }
      try {
        // Call a protected endpoint to validate token (adjust endpoint as needed)
        await httpClient.get('/volunteers/me');
        runtimeTokenCache.set(token);
        if (isMounted) setStatus('authenticated');
      } catch (err: any) {
        // A 401 from httpClient is already fully handled by handleAuthFailure
        // (token cleared, auth:failure emitted, status set to unauthenticated).
        // For non-401 failures (network error, 500, malformed token) that bypass
        // handleAuthFailure, clear explicitly here as a safety net.
        const isAuthError = (err as any)?.status === 401;
        if (!isAuthError) {
          runtimeTokenCache.clear();
          await secureTokenStore.clearToken();
        }
        if (isMounted) setStatus('unauthenticated');
      }
    }
    bootstrap();
    return () => { isMounted = false; };
  }, [setStatus]);
}
