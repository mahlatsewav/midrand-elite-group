import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF', // brand-blue
        tabBarInactiveTintColor: '#8E8E93', // brand-text-secondary
        tabBarStyle: {
          backgroundColor: '#1E1E1E', // brand-surface
          borderTopColor: '#3A3A3C',
        },
        headerStyle: {
          backgroundColor: '#121212', // brand-dark
        },
        headerTintColor: '#FFFFFF', // brand-text
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      {/* Hide the New Request screen from the tab bar */}
      <Tabs.Screen
        name="new-request"
        options={{
          href: null,
          presentation: 'modal', // Open as a modal for better UX
          title: 'New Service Request',
        }}
      />
    </Tabs>
  );
}