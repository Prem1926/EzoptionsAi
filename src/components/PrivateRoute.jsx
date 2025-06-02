// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-emerald-500"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;