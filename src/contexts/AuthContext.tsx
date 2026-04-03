import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('pickem_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role: UserRole) => {
    // In a real app, this would use Firebase Auth
    // For now, we simulate it by checking our local DB or creating a user
    const id = btoa(email).slice(0, 10); // Simple deterministic ID
    try {
      let userData = await api.getUser(id);
      
      // If the role is different, update it (for demo purposes)
      if (userData.role !== role) {
        userData = { ...userData, role };
        // In a real app, you'd call an API to update the user
        localStorage.setItem('pickem_user', JSON.stringify(userData));
      }
      
      setUser(userData);
      localStorage.setItem('pickem_user', JSON.stringify(userData));
    } catch (e) {
      const newUser = await api.createUser({
        id,
        name: email.split('@')[0],
        email,
        role,
      });
      setUser(newUser);
      localStorage.setItem('pickem_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pickem_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
