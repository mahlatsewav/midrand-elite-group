import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import '../app/global.css';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { RequestProvider } from '../context/RequestContext';


// navigation logic
const RootNavigationLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inTabsGroup) {
      router.replace('/home');
    } else if (!isAuthenticated && inTabsGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments, router]);

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