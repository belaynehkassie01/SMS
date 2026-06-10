// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import { storage } from '../utils/storage';
import { parseApiError } from '../utils/errorHandler';
import { ROLES } from '../constants/roles';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Listen for session expiry event from axios interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      logout('Session expired. Please log in again.');
    };
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    return () => window.removeEventListener('auth:sessionExpired', handleSessionExpired);
  }, []);

  // Login function (using username, password)
  const login = useCallback(async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const { token: newToken, user: userData } = await authService.login(username, password);
      
      // UserData from backend: { username, role, fullName }
      // Store in state and localStorage (already done inside authService.login)
      // But we need to sync state
      setToken(newToken);
      setUser(userData);
      
      return { success: true, user: userData, role: userData.role };
    } catch (err) {
      const message = parseApiError(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback((reason = null) => {
    authService.logout();  // clears localStorage
    setToken(null);
    setUser(null);
    setError(null);
    if (reason) {
      console.log('Logout reason:', reason);
    }
  }, []);

  // Check if user has required role
  const hasRole = useCallback((allowedRoles) => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  }, [user]);

  // Convenience getters
  const isAdmin = user?.role === ROLES.ADMIN;
  const isTeacher = user?.role === ROLES.TEACHER;
  const isStudent = user?.role === ROLES.STUDENT;

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};