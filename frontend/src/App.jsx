import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RegionalMonitoring from './pages/RegionalMonitoring';
import RiskAnalytics from './pages/RiskAnalytics';
import FarmerDirectory from './pages/FarmerDirectory';
import Broadcasts from './pages/Broadcasts';
import MarketplaceSurplus from './pages/MarketplaceSurplus';
import Settings from './pages/Settings';
import Login from './pages/Login';

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/monitoring" element={<RegionalMonitoring />} />
            <Route path="/risk-analytics" element={<RiskAnalytics />} />
            <Route path="/farmers" element={<FarmerDirectory />} />
            <Route path="/broadcasts" element={<Broadcasts />} />
            <Route path="/marketplace" element={<MarketplaceSurplus />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}
