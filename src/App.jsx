import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import FinancialDashboard from "./components/FinancialDashboard";
import Grapher from "./components/Grapher";
import Auth from "./components/Authentications"; // Import the new Auth components
import PricingScreen from './components/PricingScreen';
import SubscriptionCancel from './components/SubscriptionCancel';
import SubscriptionSuccess from './components/SubscriptionSuccess';
import AdminDashboard from './components/AdminDashboard';
import DayTrading from './components/DayTrading';
import SwingTrading from './components/SwingTrading';
import EvergreenStocks from './components/EvergreenStocks';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth.Login />} />
          <Route path="/register" element={<Auth.Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              
                <FinancialDashboard />
              
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Grapher />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/daytrading" 
            element={
              <PrivateRoute>
                <DayTrading />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/swingtrading" 
            element={
              <PrivateRoute>
                <SwingTrading />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/evergreen" 
            element={
              <PrivateRoute>
                <EvergreenStocks />
              </PrivateRoute>
            } 
          />
          <Route path="/pricing" element={<PricingScreen />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;