import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, registerApi } from '../api/authApi';

const AuthContext = createContext();

const parseToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId,
      roles: payload.roles || [],
      exp: payload.exp,
    };
  } catch {
    return null;
  }
};

const getInitialUser = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  const parsed = parseToken(token);
  const isExpired = parsed?.exp ? parsed.exp * 1000 < Date.now() : true;
  if (!parsed || isExpired) {
    localStorage.removeItem('auth_token');
    return null;
  }
  return parsed;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await loginApi(email, password);
      const token = data?.token;
      if (!token) throw new Error('Login token is missing');

      const parsed = parseToken(token);
      if (!parsed) throw new Error('Invalid token received');

      localStorage.setItem('auth_token', token);
      setUser(parsed);
      window.notify?.('success', 'Login successful');
      navigate('/dashboard');
    } catch (error) {
      window.notify?.('error', error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    try {
      setLoading(true);
      await registerApi(payload);
      window.notify?.('success', 'Registration successful. Please login.');
      navigate('/login');
    } catch (error) {
      window.notify?.('error', error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
