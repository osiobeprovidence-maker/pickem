import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  type User as FirebaseUser,
} from 'firebase/auth';
import type { User, UserRole, AuthProvider as AppAuthProvider } from '../types';
import { auth, appleProvider, firebaseConfigured, googleProvider } from '../lib/firebase';
import { convexProfiles } from '../lib/convex';

type CompleteProfileInput = {
  name?: string;
  username: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  needsProfileCompletion: boolean;
  signIn: (email: string, password: string, role: UserRole) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signInWithGoogle: (role: UserRole) => Promise<void>;
  signInWithApple: (role: UserRole) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  completeProfile: (input: CompleteProfileInput) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'pickem_user';
const PREFERRED_ROLE_KEY = 'pickem_preferred_role';

const toDefaultName = (email: string) => email.split('@')[0] || "Pick'em User";

const getProviderFromFirebaseUser = (firebaseUser: FirebaseUser): AppAuthProvider => {
  const providerIds = firebaseUser.providerData.map((provider) => provider.providerId);
  if (providerIds.includes('google.com')) return 'google';
  if (providerIds.includes('apple.com')) return 'apple';
  return 'password';
};

const hasPasswordProvider = (firebaseUser: FirebaseUser) =>
  firebaseUser.providerData.some((provider) => provider.providerId === 'password');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setStoredUser = (nextUser: User | null) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  };

  const syncFirebaseProfile = async (firebaseUser: FirebaseUser, preferredRole?: UserRole) => {
    if (!firebaseConfigured) {
      throw new Error('Firebase is not configured. Add the required VITE_FIREBASE_* values.');
    }

    if (!convexProfiles.isConfigured()) {
      throw new Error('Convex is not configured. Add VITE_CONVEX_URL to continue.');
    }

    if (!firebaseUser.email) {
      throw new Error('This account does not have an email address.');
    }

    const appUser = await convexProfiles.syncFirebaseUser({
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || toDefaultName(firebaseUser.email),
      role: preferredRole,
      authProvider: getProviderFromFirebaseUser(firebaseUser),
      hasPassword: hasPasswordProvider(firebaseUser),
      needsPasswordSetup: !hasPasswordProvider(firebaseUser),
    });

    setStoredUser(appUser);
    return appUser;
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem(LOCAL_USER_KEY);
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (error) {
        console.error('Could not restore cached user:', error);
        localStorage.removeItem(LOCAL_USER_KEY);
      }
    }

    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setStoredUser(null);
        setLoading(false);
        return;
      }

      try {
        const preferredRole = localStorage.getItem(PREFERRED_ROLE_KEY) as UserRole | null;
        await syncFirebaseProfile(firebaseUser, preferredRole ?? undefined);
      } catch (error) {
        console.error('Failed to sync Firebase session:', error);
      } finally {
        localStorage.removeItem(PREFERRED_ROLE_KEY);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string, role: UserRole) => {
    localStorage.setItem(PREFERRED_ROLE_KEY, role);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await syncFirebaseProfile(credential.user, role);
    localStorage.removeItem(PREFERRED_ROLE_KEY);
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    localStorage.setItem(PREFERRED_ROLE_KEY, role);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await syncFirebaseProfile(credential.user, role);
    localStorage.removeItem(PREFERRED_ROLE_KEY);
  };

  const signInWithGoogle = async (role: UserRole) => {
    localStorage.setItem(PREFERRED_ROLE_KEY, role);
    const credential = await signInWithPopup(auth, googleProvider);
    await syncFirebaseProfile(credential.user, role);
    localStorage.removeItem(PREFERRED_ROLE_KEY);
  };

  const signInWithApple = async (role: UserRole) => {
    localStorage.setItem(PREFERRED_ROLE_KEY, role);
    const credential = await signInWithPopup(auth, appleProvider);
    await syncFirebaseProfile(credential.user, role);
    localStorage.removeItem(PREFERRED_ROLE_KEY);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const completeProfile = async (input: CompleteProfileInput) => {
    if (!user) {
      throw new Error('You must be signed in to complete your profile.');
    }

    const firebaseUser = auth.currentUser;
    const currentHasPassword = firebaseUser ? hasPasswordProvider(firebaseUser) : user.hasPassword;

    const completed = await convexProfiles.completeUserProfile({
      id: user.id,
      name: input.name?.trim() || user.name,
      username: input.username.trim(),
      hasPassword: currentHasPassword,
      needsPasswordSetup: !currentHasPassword,
    });

    setStoredUser(completed);
  };

  const setPassword = async (password: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('No authenticated user found.');
    }

    if (hasPasswordProvider(currentUser)) {
      await updatePassword(currentUser, password);
    } else {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await linkWithCredential(currentUser, credential);
    }

    if (user) {
      await convexProfiles.markPasswordSet(user.id);
      setStoredUser({
        ...user,
        hasPassword: true,
        needs_password_setup: false,
      });
    }
  };

  const logout = async () => {
    if (firebaseConfigured) {
      await signOut(auth);
    }
    setStoredUser(null);
  };

  const needsProfileCompletion = useMemo(() => {
    if (!user) return false;
    return !user.username || Boolean(user.needs_password_setup);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        needsProfileCompletion,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithApple,
        sendPasswordReset,
        completeProfile,
        setPassword,
        logout,
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
