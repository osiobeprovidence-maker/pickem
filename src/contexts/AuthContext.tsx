import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  sendMagicLink: (email: string, role: UserRole) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  needsReAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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

  const login = async (email: string, password?: string) => {
    if (!password) {
      throw new Error('Password is required');
    }

    const authUser = await api.authenticateUser(email, password);
    setUser(authUser);
    localStorage.setItem('pickem_user', JSON.stringify(authUser));
    setNeedsReAuth(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pickem_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, sendMagicLink, setPassword, needsReAuth }}>
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
