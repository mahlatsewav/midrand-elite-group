import { useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  const { user } = useAuth()
  const role = user?.role

  if(!user) return null

  return (
    <Tabs
      key={role}
      screenOptions={{
        tabBarActiveTintColor: '#007AFF', // brand-blue
        tabBarInactiveTintColor: '#8E8E93', // brand-text-secondary
        tabBarStyle: {
          backgroundColor: '#1E1E1E', // brand-surface
          borderTopColor: '#3A3A3C',
          padding: 8, 
          height: 55
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
      {/* Home : Normal users */}
      {role === "user" ? (
        <Tabs.Screen
          name="home"
          options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
          tabBarButton: user?.role === 'worker' ? () => null : undefined,
          }}
        />
      ) : (
           <Tabs.Screen
          name="home"
          options={{
          href: null
          }}
        />
      )
      }

      {/* Home: Workers */}
      {role === "worker" && (
        <Tabs.Screen
          name="worker-dashboard"
          options={{
          title: 'Worker Dashboard',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="briefcase" color={color} />,
        }}
        />
      )}

      {/* Shared screens */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
        }}
      />

      {/* Hide the New Request screen from the tab bar */}
      <Tabs.Screen
        name="new-request"
        options={{
          href: null,
          // presentation: 'modal', // Open as a modal for better UX
          title: 'New Service Request',
        }}
      />
    </Tabs>
  );
}