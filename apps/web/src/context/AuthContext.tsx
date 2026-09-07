'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  role: string | null;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
  hasPermission: (permissionCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const res: any = await apiClient.get('/auth/me');
      setUser(res.data || res);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    const res: any = await apiClient.post('/auth/login', credentials);
    const data = res.data || res;
    
    if (data.tokens?.accessToken) {
      localStorage.setItem('token', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
      localStorage.setItem('organizationId', data.user.organizationId);
      setToken(data.tokens.accessToken);
      setUser(data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('organizationId');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (permissionCode: string) => {
    if (!user) return false;
    return user.permissions?.includes(permissionCode) || false;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
