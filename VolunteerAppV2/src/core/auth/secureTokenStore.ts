// src/core/auth/secureTokenStore.ts
// Handles secure, persistent JWT storage using Expo SecureStore
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export async function setToken(token: string): Promise<void> {
  if (__DEV__) console.log(`[secureTokenStore] setToken: ${token.slice(0, 6)}...`);
  await SecureStore.setItemAsync(TOKEN_KEY, token, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
}

export async function getToken(): Promise<string | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (__DEV__) console.log(`[secureTokenStore] getToken: ${token ? token.slice(0, 6) + '...' : 'null'}`);
  return token;
}

export async function clearToken(): Promise<void> {
  if (__DEV__) console.log('[secureTokenStore] clearToken');
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
