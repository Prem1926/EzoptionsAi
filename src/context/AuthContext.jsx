// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get('https://ezoptionsai.com/api3/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        logout();
      }
      setLoading(false);
    } catch (error) {
      logout();
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://ezoptionsai.com/api3/login', { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data);
        return response.data;
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('Login failed');
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('https://ezoptionsai.com/api3/register', { 
        name, 
        email, 
        password 
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data);
        return response.data;
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const startSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://ezoptionsai.com/api3/create-checkout-session', 
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      throw error.response ? error.response.data : new Error('Subscription failed');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      startSubscription
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};