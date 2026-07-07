// src/core/auth/useBootstrapSession.ts
// Hook to bootstrap session state on app start
import { useEffect } from 'react';
import { useSession } from './sessionStore';
import * as secureTokenStore from './secureTokenStore';
import * as runtimeTokenCache from './runtimeTokenCache';
import httpClient from '../network/httpClient';
import { VolunteerSchema } from '../../features/auth/schemas/auth.schemas';

export function useBootstrapSession() {
  const { markAuthenticated, markUnauthenticated } = useSession();

  useEffect(() => {
    let isMounted = true;
    async function bootstrap() {
      const token = await secureTokenStore.getToken();
      if (!token) {
        if (isMounted) markUnauthenticated();
        return;
      }
      try {
        // Call a protected endpoint to validate the token and identify the volunteer.
        const response = await httpClient.get('/volunteers/me');
        const parsed = VolunteerSchema.safeParse(response.data);
        if (!parsed.success) {
          throw new Error('Invalid /volunteers/me response');
        }
        runtimeTokenCache.set(token);
        if (isMounted) markAuthenticated(parsed.data.id);
      } catch (err: any) {
        // A 401 from httpClient is already fully handled by handleAuthFailure
        // (token cleared, auth:failure emitted, session marked unauthenticated).
        // For non-401 failures (network error, 500, malformed token/response) that
        // bypass handleAuthFailure, clear explicitly here as a safety net.
        const isAuthError = (err as any)?.status === 401;
        if (!isAuthError) {
          runtimeTokenCache.clear();
          await secureTokenStore.clearToken();
        }
        if (isMounted) markUnauthenticated();
      }
    }
    bootstrap();
    return () => { isMounted = false; };
  }, [markAuthenticated, markUnauthenticated]);
}
