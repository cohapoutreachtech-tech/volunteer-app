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
      const dto = await login(payload);
      console.log('[useLoginMutation] login response received');
      // Store token securely
      await secureTokenStore.setToken(dto.token);
      runtimeTokenCache.set(dto.token);
      setStatus('authenticated');
      console.log('[useLoginMutation] token stored and status set');
      return mapLoginResponseDtoToDomain(dto);
    },
  });
}
