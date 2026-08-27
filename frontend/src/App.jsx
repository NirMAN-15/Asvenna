import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import OfficerAuth from './pages/auth/OfficerAuth';
import FarmerAuth from './pages/auth/FarmerAuth';
import BuyerAuth from './pages/auth/BuyerAuth';
import Dashboard from './pages/Dashboard';
import RegionalMonitoring from './pages/RegionalMonitoring';
import RiskAnalytics from './pages/RiskAnalytics';
import FarmerDirectory from './pages/FarmerDirectory';
import Broadcasts from './pages/Broadcasts';
import MarketplaceSurplus from './pages/MarketplaceSurplus';
import Settings from './pages/Settings';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

function AppLayout() {
  // This is the authenticated shell with sidebar + navbar
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['OFFICER','FARMER','BUYER']}><Dashboard /></ProtectedRoute>} />
            <Route path="/monitoring" element={<ProtectedRoute allowedRoles={['OFFICER']}><RegionalMonitoring /></ProtectedRoute>} />
            <Route path="/risk-analytics" element={<ProtectedRoute allowedRoles={['OFFICER','FARMER']}><RiskAnalytics /></ProtectedRoute>} />
            <Route path="/farmers" element={<ProtectedRoute allowedRoles={['OFFICER']}><FarmerDirectory /></ProtectedRoute>} />
            <Route path="/broadcasts" element={<ProtectedRoute allowedRoles={['OFFICER','FARMER']}><Broadcasts /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute allowedRoles={['FARMER','BUYER']}><MarketplaceSurplus /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['OFFICER','FARMER','BUYER']}><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌾</div>
          <p>Loading ASVANNA...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/auth/officer" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <OfficerAuth />} />
      <Route path="/auth/farmer" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <FarmerAuth />} />
      <Route path="/auth/buyer" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <BuyerAuth />} />
      
      {/* Protected routes - wrapped in AppLayout */}
      <Route path="/*" element={isAuthenticated ? <AppLayout /> : <Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
