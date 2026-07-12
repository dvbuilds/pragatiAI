import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // true once we've asked the backend "am I logged in?"

  // Called on app load: if a valid refresh-token cookie exists from a previous
  // session, /auth/me (backed by the access token, refreshed transparently by
  // the interceptor if needed) will resolve and log the user back in.
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const handleExpired = () => setUser(null);
    window.addEventListener('civicpulse:session-expired', handleExpired);
    return () => window.removeEventListener('civicpulse:session-expired', handleExpired);
  }, [checkAuth]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async ({ fullName, email, password, phone }) => {
    const { data } = await api.post('/auth/register', { fullName, email, password, phone });
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // even if the network call fails, clear local state so the UI reflects logged-out
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authChecked, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
