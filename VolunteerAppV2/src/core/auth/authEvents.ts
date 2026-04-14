// src/core/auth/authEvents.ts
// Lightweight event bus for auth state changes that originate outside
// the React tree (e.g. HTTP interceptors) — avoids circular imports.
import mitt from 'mitt';

type AuthEvents = {
  'auth:failure': void;
};

export const authEvents = mitt<AuthEvents>();

if (__DEV__) {
  authEvents.on('auth:failure', () => {
    console.log('[authEvents] Emitted auth:failure event');
  });
}
