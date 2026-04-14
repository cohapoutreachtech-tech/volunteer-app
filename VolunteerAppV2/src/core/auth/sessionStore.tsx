// src/core/auth/sessionStore.tsx
// Global session state for authentication and bootstrapping
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authEvents } from './authEvents';

export type SessionStatus = 'bootstrapping' | 'authenticated' | 'unauthenticated';

interface SessionContextValue {
  status: SessionStatus;
  setStatus: (status: SessionStatus) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('bootstrapping');

  useEffect(() => {
    console.log('[SessionProvider] Mounted');
    return () => console.log('[SessionProvider] Unmounted');
  }, []);

  useEffect(() => {
    console.log(`[SessionProvider] Session status changed: ${status}`);
  }, [status]);

  useEffect(() => {
    const handler = () => {
      console.log('[SessionProvider] Received auth:failure event, setting status to unauthenticated');
      setStatus('unauthenticated');
    };
    authEvents.on('auth:failure', handler);
    return () => authEvents.off('auth:failure', handler);
  }, []);

  return (
    <SessionContext.Provider value={{ status, setStatus }}>
      {/* DEV: Show session status for testing */}
      {__DEV__ && (
        <div style={{ position: 'absolute', top: 0, left: 0, background: '#eee', zIndex: 9999, padding: 4, fontSize: 12 }}>
          Session: {status}
        </div>
      )}
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}
