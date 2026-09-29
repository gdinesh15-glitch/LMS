import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/services/authService';

const AuthContext = createContext(null);

// Validate that a token is a structurally valid JWT (3 base64 parts separated by dots)
// Mock tokens like "mock-token-12345" will fail this check
const isValidJWT = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(p => p.length > 0);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('session');
    const token = localStorage.getItem('token');

    if (storedUser && isValidJWT(token)) {
      // Token looks like a real JWT — restore session
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted session JSON — clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('session');
      }
    } else if (storedUser || token) {
      // Something is stored but it's not a valid JWT (e.g. old mock token)
      // Clear it so the user is redirected to login and gets a fresh real token
      console.warn('[Auth] Clearing stale/mock session from localStorage.');
      localStorage.removeItem('token');
      localStorage.removeItem('session');
    }

    setLoading(false);
  }, []);

  const login = async (userId, password, role) => {
    const result = await authService.login(userId, password, role);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center',
        background: '#0f172a', color: '#e2e8f0', fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📚</div>
          <p>Loading BiblioTech LMS...</p>
        </div>
      </div>
    );
  }

  const updateUserData = (updatedUser) => {
    // Merge new data with existing user data
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem('session', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
