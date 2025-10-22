import { router, useRouter, useSegments } from 'expo-router';
import React, { createContext, ReactNode, useContext, useState } from 'react';

type Role = "user" | "worker" | "admin";

// Mock User Data
const MOCK_USER : User = {
  id: 'u1',
  firstName: 'Mahlatse',
  email: 'mahlatse@gmail.com',
  role: "worker"
};

interface User {
  id: string;
  firstName: string;
  email: string;
  role: Role
}

interface AuthContextType {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = (segments[0] as string) === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/');
    } else if (user && inAuthGroup) {
      router.replace('/home');
    }
  }, [user, segments, router]);
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // useProtectedRoute(user);

  const signIn = () => {
    setUser(MOCK_USER);
    
    if (user?.role === "worker") {
      router.push("/(tabs)/worker-dashboard")
    } else if (user?.role === "user") {
      router.push("/(tabs)/home")
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}