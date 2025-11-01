import { router, useRouter, useSegments } from 'expo-router';
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type Role = 'user' | 'worker' | 'admin';

interface User {
  id: string;
  firstName: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, role: Role) => Promise<void>; // Added role
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] as string === '(auth)';
    const currentPath = segments.join('/');

    if (!user && !inAuthGroup) {
      router.replace('/');
    } else if (user && inAuthGroup) {
      // Redirect based on role after auth
      if (user.role === 'worker') {
        router.replace('/(tabs)/worker-dashboard');
      } else {
        router.replace('/(tabs)/home');
      }
    } else if (user) {
      // role-based access
      if (user.role !== 'worker' && currentPath.includes('worker-dashboard')) {
        router.replace('/(tabs)/home');
      } else if (user.role !== 'user' && (currentPath.includes('home') || currentPath.includes('new-request'))) {
        router.replace('/(tabs)/worker-dashboard');
      }
    }
  }, [user, segments, router]);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const newUser = {
            id: firebaseUser.uid,
            firstName: data.firstName || 'Unknown',
            email: firebaseUser.email || '',
            role: data.role || 'user',
          };
          setUser(newUser);
          // Role-based initial route
          if (newUser.role === 'worker') {
            router.push('/(tabs)/worker-dashboard');
          } else if (newUser.role === 'user') {
            router.push('/(tabs)/home');
          }
        } else {
          console.log('No user document found for UID:', firebaseUser.uid);
          setUser({
            id: firebaseUser.uid,
            firstName: 'Unknown',
            email: firebaseUser.email || '',
            role: 'user',
          });
          router.push('/(tabs)/home');
        }
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, firstName: string, role: Role) => { // Added role
    // Create the auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create user document in Firestore with role
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      firstName: firstName,
      email: email,
      role: role, // Use selected role
      createdAt: new Date().toISOString(),
    });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
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