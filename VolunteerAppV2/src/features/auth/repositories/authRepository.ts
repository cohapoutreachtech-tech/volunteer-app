import httpClient from '../../../core/network/httpClient';
import { LoginRequestDto, LoginResponseDto } from '../dto/auth.dto';
import { LoginResponseSchema } from '../schemas/auth.schemas';

export async function login(payload: LoginRequestDto): Promise<LoginResponseDto> {
  console.log('[authRepository] login payload', { email: payload.email });
  const response = await httpClient.post('/auth/login', payload);
  console.log('[authRepository] raw response', { status: response.status, data: response.data });
  // Validate response
  const parsed = LoginResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error('[authRepository] invalid login response', parsed.error);
    throw new Error('Invalid login response');
  }
  return parsed.data;
}
