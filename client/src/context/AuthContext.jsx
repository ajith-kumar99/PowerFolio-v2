import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // DYNAMIC API URL:
  // 1. In Development (localhost), it falls back to localhost:5000
  // 2. In Production (Vercel), it uses the Environment Variable VITE_API_URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Check if user is logged in on initial load
  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userInfo = localStorage.getItem('userInfo');
      
      if (token && userInfo) {
        setUser(JSON.parse(userInfo));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  };

  // Helper to update local state & storage after profile edit
  const updateUser = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save to local storage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      setUser(data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Signup Function
  const signup = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      setUser(data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      signup, 
      logout,
      updateUser,
      API_URL 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};