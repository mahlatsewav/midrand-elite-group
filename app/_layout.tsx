import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import './global.css';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { RequestProvider } from '../context/RequestContext';
import React from 'react';

// navigation logic
const RootNavigationLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && inTabsGroup) {
      router.replace('/');
    }
    
  }, [isAuthenticated, segments, router, user]);

  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
  );
};


export default function RootLayout() {
  return (
    <AuthProvider>
      <RequestProvider>
        <StatusBar style="light" />
        <RootNavigationLayout />
      </RequestProvider>
    </AuthProvider>
  );
}