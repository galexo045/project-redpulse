
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { api } from '../services/mockApi';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'donations'>) => Promise<User>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await api.loginUser(email);
      setCurrentUser(user);
      return user;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'donations'>) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await api.registerUser(userData);
      setCurrentUser(newUser);
      return newUser;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = { currentUser, login, logout, register, loading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
