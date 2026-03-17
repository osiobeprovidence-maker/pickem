import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendMagicLink: (email: string, role: UserRole) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  needsReAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsReAuth, setNeedsReAuth] = useState(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      await api.ensureSystemUsers();
      const savedUser = localStorage.getItem('pickem_user');

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as User;
        const storedUser = await api.findUserByEmail(parsedUser.email);

        if (storedUser && storedUser.status !== 'removed') {
          setUser(storedUser);
          localStorage.setItem('pickem_user', JSON.stringify(storedUser));

          if (storedUser.lastMagicLogin) {
            const lastLogin = new Date(storedUser.lastMagicLogin).getTime();
            const fortyEightHours = 48 * 60 * 60 * 1000;
            if (Date.now() - lastLogin > fortyEightHours && !storedUser.hasPassword) {
              setNeedsReAuth(true);
            }
          }
        } else {
          localStorage.removeItem('pickem_user');
        }
      }

      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setFirebaseUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Sign in with Firebase
    const credential = await signInWithEmailAndPassword(auth, email, password);

    // Also get/create user in local system
    let localUser = await api.findUserByEmail(email);
    if (!localUser) {
      localUser = await api.createUser({
        name: credential.user.displayName || email.split('@')[0],
        email,
        role: 'customer',
        status: 'approved',
        hasPassword: true,
        email_verified: true,
      });
    }

    setUser(localUser);
    localStorage.setItem('pickem_user', JSON.stringify(localUser));
    setNeedsReAuth(false);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Create Firebase account
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    // Create user in local system
    const localUser = await api.createUser({
      name,
      email,
      role: 'customer',
      status: 'approved',
      hasPassword: true,
      email_verified: true,
    });

    setUser(localUser);
    localStorage.setItem('pickem_user', JSON.stringify(localUser));
  };

  const loginWithGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider);

    // Get or create user in local system
    let localUser = await api.findUserByEmail(credential.user.email!);
    if (!localUser) {
      localUser = await api.createUser({
        name: credential.user.displayName || credential.user.email!.split('@')[0],
        email: credential.user.email!,
        role: 'customer',
        status: 'approved',
        hasPassword: false,
        email_verified: true,
      });
    }

    setUser(localUser);
    localStorage.setItem('pickem_user', JSON.stringify(localUser));
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendMagicLink = async (email: string, role: UserRole) => {
    const authUser = await api.issueMagicLogin(email, role);
    setUser(authUser);
    localStorage.setItem('pickem_user', JSON.stringify(authUser));
    setNeedsReAuth(false);
  };

  const setPassword = async (password: string) => {
    if (!user) return;
    const updatedUser = await api.setUserPassword(user.id, password);
    setUser(updatedUser);
    localStorage.setItem('pickem_user', JSON.stringify(updatedUser));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('pickem_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      login,
      signUp,
      loginWithGoogle,
      sendPasswordReset,
      logout,
      loading,
      sendMagicLink,
      setPassword,
      needsReAuth
    }}>
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
