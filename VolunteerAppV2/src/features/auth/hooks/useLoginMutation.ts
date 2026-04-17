import { useMutation } from '@tanstack/react-query';
import { login } from '../repositories/authRepository';
import { mapLoginResponseDtoToDomain } from '../mappers/auth.mapper';
import * as secureTokenStore from '../../../core/auth/secureTokenStore';
import * as runtimeTokenCache from '../../../core/auth/runtimeTokenCache';
import { useSession } from '../../../core/auth/sessionStore';

export function useLoginMutation() {
  const { setStatus } = useSession();


  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      console.log('[useLoginMutation] mutationFn start', { email: payload.email });
      // login is defined in authRepository and calls httpClient directly, returning a validated DTO
      const dto = await login(payload);
      console.log('[useLoginMutation] login response received');
      // Store token securely
      // this is defined in secureTokenStore and uses Expo SecureStore under the hood
      await secureTokenStore.setToken(dto.token);
      runtimeTokenCache.set(dto.token);
      setStatus('authenticated');
      console.log('[useLoginMutation] token stored and status set');
      return mapLoginResponseDtoToDomain(dto);
    },
  });
}
