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
import ProxyRequest from './pages/ProxyRequest';
import BuyAndDeliver from './pages/BuyAndDeliver';
import BusinessDashboard from './pages/BusinessDashboard';
import Storefront from './pages/Storefront';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import BuyDeliverDashboard from './pages/BuyDeliverDashboard';
import ProxyDashboard from './pages/ProxyDashboard';
import RunnerDashboard from './pages/RunnerDashboard';
import RequestDelivery from './pages/RequestDelivery';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (user.role !== 'admin' || user.status !== 'approved') return <Navigate to="/dashboard" />;

  return <>{children}</>;
}

function DashboardRouter() {
  const { user } = useAuth();

  if (user?.role === 'runner') return <RunnerDashboard />;
  // For business users, /dashboard shows the customer view (buying/sending)
  // while /dashboard/business shows the merchant view
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
          <Route
            path="/proxy-request"
            element={
              <ProtectedRoute>
                <ProxyRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/business"
            element={
              <ProtectedRoute>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/store/:id" element={<Storefront />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
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
          <Route
            path="/dashboard/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
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
