// src/core/auth/runtimeTokenCache.ts
// Handles ephemeral, in-memory JWT cache for runtime speed

let token: string | null = null;

export function set(tokenValue: string) {
  if (__DEV__) console.log(`[runtimeTokenCache] set: ${tokenValue.slice(0, 6)}...`);
  token = tokenValue;
}

export function get(): string | null {
  if (__DEV__) console.log(`[runtimeTokenCache] get: ${token ? token.slice(0, 6) + '...' : 'null'}`);
  return token;
}

export function clear() {
  if (__DEV__) console.log('[runtimeTokenCache] clear');
  token = null;
}
