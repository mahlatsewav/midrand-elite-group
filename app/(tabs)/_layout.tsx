import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { user } = useAuth();
  const role = user?.role || 'user'; // Default to 'user' if not loaded

  const inset = useSafeAreaInsets()
  
  const tabHeight = inset.bottom ? 40 + inset.bottom : 70

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#60A5FA', // brand-blue
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          bottom: 0,
          backgroundColor: '#1A1A1E',
          paddingBottom: 10,
          paddingTop: 2, 
          height: tabHeight,
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
        name="admin-dashboard"
        options={{
          title: 'Dashboard',
          href: role === 'admin' ? '/(tabs)/admin-dashboard' : null, // Hide for workers and users
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name='admin-panel-settings'
              size={size}
              color={color}
            />
          )
        }}
      />
 
       <Tabs.Screen
        name="pending-request"
        options={{
          title: 'request',
          href: role === 'admin' ? '/(tabs)/pending-request' : null, // Hide for workers
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'timeline-check' : 'timeline-check-outline'}
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