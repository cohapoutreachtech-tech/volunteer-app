// src/core/auth/sessionStore.tsx
// Global session state for authentication and bootstrapping
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { authEvents } from './authEvents';

export type SessionStatus = 'bootstrapping' | 'authenticated' | 'unauthenticated';

interface SessionContextValue {
  status: SessionStatus;
  volunteerId: string | null;
  markAuthenticated: (volunteerId: string) => void;
  markUnauthenticated: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('bootstrapping');
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const markAuthenticated = useCallback((id: string) => {
    setVolunteerId(id);
    setStatus('authenticated');
  }, []);

  const markUnauthenticated = useCallback(() => {
    setVolunteerId(null);
    setStatus('unauthenticated');
    // Session ended: don't let the next signed-in user see a previous
    // volunteer's cached queries.
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    console.log('[SessionProvider] Mounted');
    return () => console.log('[SessionProvider] Unmounted');
  }, []);

  useEffect(() => {
    console.log(`[SessionProvider] Session status changed: ${status}`);
  }, [status]);

  useEffect(() => {
    const handler = () => {
      console.log('[SessionProvider] Received auth:failure event, marking unauthenticated');
      markUnauthenticated();
    };
    authEvents.on('auth:failure', handler);
    return () => authEvents.off('auth:failure', handler);
  }, [markUnauthenticated]);

  return (
    <SessionContext.Provider value={{ status, volunteerId, markAuthenticated, markUnauthenticated }}>
      {/* DEV: Show session status for testing */}
      {__DEV__ && (
        <View style={styles.devBadge} pointerEvents="none">
          <Text style={styles.devBadgeText}>Session: {status}</Text>
        </View>
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

const styles = StyleSheet.create({
  devBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#eee',
    zIndex: 9999,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  devBadgeText: {
    fontSize: 11,
    color: '#111',
  },
});
