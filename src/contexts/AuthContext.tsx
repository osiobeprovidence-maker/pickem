import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  EmailAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { auth, googleProvider } from '../lib/firebase';
import { convexProfiles } from '../lib/convex';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  loginWithApple: (role: UserRole) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  completeProfile: (input: { name: string; username: string }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  needsProfileCompletion: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const appleProvider = new OAuthProvider('apple.com');

const getProviderIds = (currentUser: FirebaseUser) =>
  new Set(currentUser.providerData.map((provider) => provider.providerId).filter(Boolean));

const inferAuthProvider = (currentUser: FirebaseUser): 'password' | 'google' | 'apple' => {
  const providers = getProviderIds(currentUser);
  if (providers.has('google.com')) return 'google';
  if (providers.has('apple.com')) return 'apple';
  return 'password';
};

const hasPasswordProvider = (currentUser: FirebaseUser) => getProviderIds(currentUser).has('password');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const persistMirrorUser = async (nextUser: User) => {
    const existingMirror = await api.findUserByEmail(nextUser.email);

    if (existingMirror) {
      await api.updateUser(existingMirror.id, nextUser);
    } else {
      await api.createUser(nextUser);
    }

    localStorage.setItem('pickem_user', JSON.stringify(nextUser));
  };

  const syncFirebaseProfile = async (
    currentFirebaseUser: FirebaseUser,
    preferredRole?: UserRole,
  ) => {
    if (!currentFirebaseUser.email) {
      throw new Error('Your authentication provider did not return an email address.');
    }

    const baseName = currentFirebaseUser.displayName || currentFirebaseUser.email.split('@')[0] || 'Pickem User';
    const provider = inferAuthProvider(currentFirebaseUser);
    const hasPassword = hasPasswordProvider(currentFirebaseUser);

    let syncedUser: User | null = null;

    if (convexProfiles.isConfigured()) {
      syncedUser = await convexProfiles.syncFirebaseUser({
        firebaseUid: currentFirebaseUser.uid,
        email: currentFirebaseUser.email,
        name: baseName,
        role: preferredRole,
        authProvider: provider,
        hasPassword,
        needsPasswordSetup: !hasPassword,
      });
    }

    if (!syncedUser) {
      const existingUser = await api.findUserByEmail(currentFirebaseUser.email);
      syncedUser = existingUser || (await api.createUser({
        name: baseName,
        email: currentFirebaseUser.email,
        firebase_uid: currentFirebaseUser.uid,
        auth_provider: provider,
        role: preferredRole || 'customer',
        status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        hasPassword,
        needs_password_setup: !hasPassword,
        email_verified: true,
      }));
    }

    await persistMirrorUser(syncedUser);
    setUser(syncedUser);
    return syncedUser;
  };

  useEffect(() => {
    let isActive = true;

    const unsubscribe = auth.onAuthStateChanged(async (nextFirebaseUser) => {
      if (!isActive) return;

      setFirebaseUser(nextFirebaseUser);

      if (!nextFirebaseUser) {
        setUser(null);
        localStorage.removeItem('pickem_user');
        setLoading(false);
        return;
      }

      try {
        await syncFirebaseProfile(nextFirebaseUser);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await syncFirebaseProfile(credential.user);
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await syncFirebaseProfile(credential.user, role);
  };

  const loginWithGoogle = async (role: UserRole) => {
    const credential = await signInWithPopup(auth, googleProvider);
    await syncFirebaseProfile(credential.user, role);
  };

  const loginWithApple = async (role: UserRole) => {
    const credential = await signInWithPopup(auth, appleProvider);
    await syncFirebaseProfile(credential.user, role);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const setPassword = async (password: string) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('Please sign in before setting a password.');
    }

    if (!hasPasswordProvider(auth.currentUser)) {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await linkWithCredential(auth.currentUser, credential);
    }

    const refreshedUser = await syncFirebaseProfile(auth.currentUser, user?.role);
    if (refreshedUser) {
      setUser({
        ...refreshedUser,
        hasPassword: true,
        needs_password_setup: false,
      });
    }
  };

  const completeProfile = async (input: { name: string; username: string }) => {
    if (!user) {
      throw new Error('Please sign in to continue.');
    }

    const trimmedUsername = input.username.trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(trimmedUsername)) {
      throw new Error('Username must be 3-20 characters using letters, numbers, or underscores.');
    }

    if (convexProfiles.isConfigured()) {
      const isAvailable = await convexProfiles.isUsernameAvailable(trimmedUsername, user.id);
      if (!isAvailable) {
        throw new Error('That username is already taken.');
      }

      const currentHasPassword = auth.currentUser ? hasPasswordProvider(auth.currentUser) : Boolean(user.hasPassword);
      const updatedUser = await convexProfiles.completeUserProfile({
        id: user.id,
        name: input.name.trim(),
        username: trimmedUsername,
        hasPassword: currentHasPassword,
        needsPasswordSetup: !currentHasPassword && user.needs_password_setup,
      });

      if (updatedUser) {
        await persistMirrorUser(updatedUser);
        setUser(updatedUser);
        return;
      }
    }

    const updatedUser = {
      ...user,
      name: input.name.trim(),
      username: trimmedUsername,
      updated_at: new Date().toISOString(),
    };

    await persistMirrorUser(updatedUser);
    setUser(updatedUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('pickem_user');
  };

  const needsProfileCompletion = Boolean(user && (!user.username || user.needs_password_setup));

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        login,
        signUp,
        loginWithGoogle,
        loginWithApple,
        sendPasswordReset,
        setPassword,
        completeProfile,
        logout,
        loading,
        needsProfileCompletion,
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
