import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from '../src/core/auth/sessionStore';
import { useBootstrapSession } from '../src/core/auth/useBootstrapSession';

function Bootstrapper({ children }: { children: React.ReactNode }) {
  useBootstrapSession();
  return <>{children}</>;
}

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <Bootstrapper>
                    <SafeAreaProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(onboarding)" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="event/[id]" />
                        </Stack>
                    </SafeAreaProvider>
                </Bootstrapper>
            </SessionProvider>
        </QueryClientProvider>
    );
}
