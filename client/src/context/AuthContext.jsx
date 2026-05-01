import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../api/client';
import { safeParseJSON } from '../utils/safeStorage';
import STORAGE_KEYS from '../utils/storageKeys';

const AuthContext = createContext(null);

const getInitialUser = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return safeParseJSON(raw, null);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser());
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.token));

  const saveSession = useCallback((payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem(STORAGE_KEYS.token, payload.token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(payload.user));
  }, []);

  const signup = useCallback(async (form) => {
    const { data } = await api.post('/auth/signup', form);
    saveSession(data);
  }, [saveSession]);

  const login = useCallback(async (form) => {
    const { data } = await api.post('/auth/login', form);
    saveSession(data);
  }, [saveSession]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
  }, []);

  const value = useMemo(() => ({ user, token, signup, login, logout, isAuthenticated: Boolean(token) }), [user, token, signup, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
