import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();
  const role = user?.role || 'user'; // Default to 'user' if not loaded

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#60A5FA', // brand-blue
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#1A1A1E',
          paddingBottom: 10,
          paddingTop: 8, 
          height: 70,
          borderTopWidth: 0
        }, // brand-dark
      }}

    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          href: role === 'user' ? '/(tabs)/home' : null, // Hide for workers
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="new-request"
        options={{
          title: 'New Request',
          href: role === 'user' ? '/(tabs)/new-request' : null, // Hide for workers
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="worker-dashboard"
        options={{
          title: 'Dashboard',
          href: role === 'worker' ? '/(tabs)/worker-dashboard' : null, // Hide for users
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'briefcase' : 'briefcase-outline'}
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // Visible to both
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  );
}