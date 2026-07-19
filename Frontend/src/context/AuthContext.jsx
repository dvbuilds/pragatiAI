import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { setAccessToken, clearAccessToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // true once we've asked the backend "am I logged in?"

  // Called on app load: if a valid refresh-token cookie exists from a previous
  // session, /auth/me (backed by the access token, refreshed transparently by
  // the interceptor if needed) will resolve and log the user back in. This
  // still depends on the cookie surviving a full page reload, which is fine —
  // by definition there's no in-memory token left after a reload either way,
  // so cookie-based silent login is the correct fallback here.
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data);
    } catch {
      setUser(null);
      clearAccessToken();
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const handleExpired = () => {
      setUser(null);
      clearAccessToken();
    };
    window.addEventListener('civicpulse:session-expired', handleExpired);
    return () => window.removeEventListener('civicpulse:session-expired', handleExpired);
  }, [checkAuth]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    // Keep the access token in memory so every request after this attaches
    // it as a Bearer header — doesn't depend on the accessToken cookie
    // actually having been accepted by the browser (see lib/api.js).
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async ({ fullName, email, password, phone }) => {
    const { data } = await api.post('/auth/register', { fullName, email, password, phone });
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // even if the network call fails, clear local state so the UI reflects logged-out
    }
    clearAccessToken();
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