import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login, register, logout } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const res = await getMe();
      if (res && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Auth verification failed', err);
      // Only clear if 401
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const res = await login(credentials);
      if (res.token) {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        toast.success(res.message || 'Welcome back to FINDY!');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
      return false;
    }
  };

  const handleRegister = async (data) => {
    try {
      const res = await register(data);
      if (res.token) {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        toast.success(res.message || 'Your FINDY student account has been created.');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
