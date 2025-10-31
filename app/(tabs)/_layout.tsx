import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import React from 'react';

export default function TabLayout() {
  const { user } = useAuth();
  const role = user?.role || 'user'; // Default to 'user' if not loaded

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#60A5FA', // brand-blue
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: { backgroundColor: '#1A1A1E' }, // brand-dark
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          href: role === 'user' ? '/(tabs)/home' : null, // Hide for workers
        }}
      />
      <Tabs.Screen
        name="new-request"
        options={{
          title: 'New Request',
          href: role === 'user' ? '/(tabs)/new-request' : null, // Hide for workers
        }}
      />
      <Tabs.Screen
        name="worker-dashboard"
        options={{
          title: 'Dashboard',
          href: role === 'worker' ? '/(tabs)/worker-dashboard' : null, // Hide for users
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // Visible to both
        }}
      />
    </Tabs>
  );
}