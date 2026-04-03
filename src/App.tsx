/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Businesses from './pages/Businesses';
import BecomeRunner from './pages/BecomeRunner';
import ProxyPickup from './pages/ProxyPickup';
import BuyAndDeliver from './pages/BuyAndDeliver';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import CompleteProfile from './pages/CompleteProfile';
import CustomerDashboard from './pages/CustomerDashboard';
import BuyDeliverDashboard from './pages/BuyDeliverDashboard';
import ProxyDashboard from './pages/ProxyDashboard';
import RunnerDashboard from './pages/RunnerDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import RequestDelivery from './pages/RequestDelivery';
import Profile from './pages/Profile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, needsProfileCompletion } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (needsProfileCompletion) return <Navigate to="/complete-profile" replace />;

  return <>{children}</>;
}

function AuthRoute() {
  const { user, loading, needsProfileCompletion } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Auth />;
  return <Navigate to={needsProfileCompletion ? '/complete-profile' : '/dashboard'} replace />;
}

function CompleteProfileRoute() {
  const { user, loading, needsProfileCompletion } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!needsProfileCompletion) return <Navigate to="/dashboard" replace />;
  return <CompleteProfile />;
}

function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === 'runner') return <RunnerDashboard />;
  if (user?.role === 'business') return <BusinessDashboard />;
  return <CustomerDashboard />;
}

function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/buy-and-deliver" element={<BuyAndDeliver />} />
          <Route path="/become-runner" element={<BecomeRunner />} />
          <Route path="/proxy-pickup" element={<ProxyPickup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<AuthRoute />} />
          <Route path="/complete-profile" element={<CompleteProfileRoute />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/buy-deliver"
            element={
              <ProtectedRoute>
                <BuyDeliverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/proxy"
            element={
              <ProtectedRoute>
                <ProxyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request"
            element={
              <ProtectedRoute>
                <RequestDelivery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
