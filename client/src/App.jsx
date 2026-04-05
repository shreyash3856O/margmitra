import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for performance optimization
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const FleetPage = lazy(() => import('./pages/FleetPage'));
const CityHeatmap = lazy(() => import('./pages/CityHeatmap'));
const Analytics = lazy(() => import('./pages/Analytics'));
const ZoneInsights = lazy(() => import('./pages/ZoneInsights'));
const Emissions = lazy(() => import('./pages/Emissions'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const EntropyDemo = lazy(() => import('./components/ui/entropy-demo'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

// Public pages get Navbar + Footer
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <Suspense fallback={<div className="loading-screen">Loading MargMitra...</div>}>
            <Routes>
              {/* Public Routes (with Navbar + Footer) */}
              <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
              <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

              {/* Protected Dashboard Routes (with Sidebar layout — handled inside each page) */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/heatmap" element={
                <ProtectedRoute><CityHeatmap /></ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute><Analytics /></ProtectedRoute>
              } />
              <Route path="/zone-insights" element={
                <ProtectedRoute><ZoneInsights /></ProtectedRoute>
              } />
              <Route path="/emissions" element={
                <ProtectedRoute><Emissions /></ProtectedRoute>
              } />
              <Route path="/book" element={
                <ProtectedRoute><BookingPage /></ProtectedRoute>
              } />
              <Route path="/fleet" element={
                <ProtectedRoute><FleetPage /></ProtectedRoute>
              } />

              {/* Placeholder routes for sidebar links */}
              <Route path="/notifications" element={
                <ProtectedRoute><Notifications /></ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute><Settings /></ProtectedRoute>
              } />
              <Route path="/entropy-demo" element={<EntropyDemo />} />
            </Routes>
          </Suspense>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
