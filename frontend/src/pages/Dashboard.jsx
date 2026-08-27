import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import API from '../services/api';
import RiskBadge from '../components/RiskBadge';
import ProxyDataModal from '../components/ProxyDataModal';
import BroadcastModal from '../components/BroadcastModal';
import FarmerPlantingModal from '../components/FarmerPlantingModal';
import { Users, Sprout, AlertTriangle, ShoppingCart, PlusCircle, Radio, ArrowRight, Activity, Sparkles, ShieldCheck, Tag, MapPin, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { role, user } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);

  const [summary, setSummary] = useState([
    { crop: { nameEn: 'Leeks', nameSi: 'ලීක්ස්', nameTa: 'லீක්ස්' }, totalPlantedAcres: 68.0, estimatedSupplyKg: 544000, targetDemandKg: 588000, riskPercentage: 92.5, riskLevel: 'OVER_PLANTED' },
    { crop: { nameEn: 'Cabbage', nameSi: 'ගෝවා', nameTa: 'முட்டைக்கோස්' }, totalPlantedAcres: 45.5, estimatedSupplyKg: 546000, targetDemandKg: 700000, riskPercentage: 78.0, riskLevel: 'WARNING' },
    { crop: { nameEn: 'Carrot', nameSi: 'කැරට්', nameTa: 'கேரட்' }, totalPlantedAcres: 38.0, estimatedSupplyKg: 380000, targetDemandKg: 700000, riskPercentage: 54.2, riskLevel: 'SAFE' },
    { crop: { nameEn: 'Beetroot', nameSi: 'බීට්රූට්', nameTa: 'பீட்ரூට්' }, totalPlantedAcres: 33.0, estimatedSupplyKg: 297000, targetDemandKg: 700000, riskPercentage: 42.4, riskLevel: 'SAFE' }
  ]);

  const [stats, setStats] = useState({
    totalFarmers: 142,
    totalAcres: 184.5,
    highRiskAlerts: 1,
    surplusKg: 5200
  });

  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/risk/regional-summary?district=Badulla');
      if (res.data && res.data.data && res.data.data.length > 0) {
        setSummary(res.data.data);
      }
    } catch (err) {
      console.warn('Utilizing Bandarawela seed telemetry:', err.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 1. FARMER ROLE VIEW
  if (role === 'FARMER') {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Header Banner for Farmer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 stich-card p-6 bg-gradient-to-r from-emerald-950/90 via-emerald-900/50 to-transparent border border-emerald-500/40">
          <div>
            <div className="flex items-center space-x-2">
              <Sprout className="w-7 h-7 text-emerald-400" />
              <h1 className="text-2xl font-extrabold text-white">Ayubowan, {user.full_name}! (ආයුබෝවන්)</h1>
            </div>
            <p className="text-xs text-emerald-300/80 mt-1">
              Farmer Cultivation Portal • Bandarawela Upcountry Agrarian Division
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFarmerModalOpen(true)}
              className="stich-btn-primary flex items-center gap-2 text-sm shadow-emerald-700/40"
            >
              <PlusCircle className="w-4 h-4" />
              🌱 Log New Cultivation
            </button>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Sell Surplus Produce
            </Link>
          </div>
        </div>

        {/* Farmer Personal KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stich-card p-5 border-l-4 border-l-emerald-500">
            <p className="text-xs text-emerald-400 font-bold uppercase">My Registered Land</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{user.land_size || 2.5} Acres</h3>
            <p className="text-[11px] text-emerald-500 mt-1">Bandarawela Upcountry Soil</p>
          </div>
          <div className="stich-card p-5 border-l-4 border-l-amber-500">
            <p className="text-xs text-amber-400 font-bold uppercase">Active Crop Season</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">Leeks (ලීක්ස්)</h3>
            <p className="text-[11px] text-amber-400 mt-1">Status: OVER-PLANTED (92.5%)</p>
          </div>
          <div className="stich-card p-5 border-l-4 border-l-teal-500">
            <p className="text-xs text-teal-400 font-bold uppercase">Surplus Produce Available</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">500 kg</h3>
            <p className="text-[11px] text-teal-400 mt-1">Listed on 5km Marketplace</p>
          </div>
        </div>

        {/* Over-Planting Warning & Smart Alternatives for Farmer */}
        <div className="stich-card p-6 border-l-4 border-l-red-500 bg-gradient-to-r from-red-950/30 via-emerald-950/30 to-transparent">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 animate-bounce mt-1" />
            <div>
              <h3 className="text-base font-extrabold text-white">⚠️ Over-Planting Alert for Leeks in Bandarawela</h3>
              <p className="text-xs text-red-300/90 mt-1 leading-relaxed">
                Regional leek planting has reached <span className="font-bold underline text-white">92.5% of market quota</span>. Consider planting recommended alternatives like <span className="font-bold text-emerald-400">Beetroot (බීට්රූට්)</span> or <span className="font-bold text-emerald-400 font-sans">Radish (රාබු)</span> to maximize harvest profit.
              </p>
              <div className="mt-4">
                <Link to="/risk-analytics" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
                  <Compass className="w-4 h-4 text-amber-400" /> View Smart Crop Alternatives <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Cultivation Modal */}
        <FarmerPlantingModal isOpen={isFarmerModalOpen} onClose={() => setIsFarmerModalOpen(false)} onPlantingAdded={fetchDashboardData} />
      </div>
    );
  }

  // 2. LOCAL BUYER ROLE VIEW
  if (role === 'BUYER') {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Header Banner for Buyer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 stich-card p-6 bg-gradient-to-r from-emerald-950/90 via-emerald-900/50 to-transparent border border-emerald-500/40">
          <div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-7 h-7 text-emerald-400" />
              <h1 className="text-2xl font-extrabold text-white">Welcome, {user.full_name}!</h1>
            </div>
            <p className="text-xs text-emerald-300/80 mt-1">
              Local Buyer Zero-Waste Marketplace Hub • Bandarawela 5 km Radius
            </p>
          </div>

          <Link
            to="/marketplace"
            className="stich-btn-primary flex items-center gap-2 text-sm shadow-emerald-700/40"
          >
            <ShoppingCart className="w-4 h-4" />
            Browse 5 km Surplus Produce
          </Link>
        </div>

        {/* Buyer Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stich-card p-5 border-l-4 border-l-emerald-500">
            <p className="text-xs text-emerald-400 font-bold uppercase">Surplus Produce Listings Nearby</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">12 Batches</h3>
            <p className="text-[11px] text-emerald-500 mt-1">Within 5 km radius</p>
          </div>
          <div className="stich-card p-5 border-l-4 border-l-amber-500">
            <p className="text-xs text-amber-400 font-bold uppercase">Active Negotiations</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">2 Direct Chats</h3>
            <p className="text-[11px] text-amber-400 mt-1">30-minute response window</p>
          </div>
          <div className="stich-card p-5 border-l-4 border-l-teal-500">
            <p className="text-xs text-teal-400 font-bold uppercase">Completed Procurement</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">1,250 kg</h3>
            <p className="text-[11px] text-teal-400 mt-1">Saved from post-harvest waste</p>
          </div>
        </div>

        {/* Nearby Available Produce Preview */}
        <div className="stich-card p-6">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-4">
            <h3 className="text-base font-extrabold text-white">🛒 Fresh Surplus Produce Available for Immediate Procurement</h3>
            <Link to="/marketplace" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">View All Listings &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/20 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white text-sm">Leeks (ලීක්ස්) - 500 kg</h4>
                <p className="text-xs text-emerald-400/80 mt-0.5">Farmer: Sunil Shantha • Main St, Bandarawela (1.8 km)</p>
                <p className="text-xs font-extrabold text-amber-400 mt-1">Asking: Rs 180 / kg</p>
              </div>
              <Link to="/marketplace" className="stich-btn-primary text-xs px-3 py-1.5">Negotiate / Order</Link>
            </div>
            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/20 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white text-sm">Carrot (කැරට්) - 300 kg</h4>
                <p className="text-xs text-emerald-400/80 mt-0.5">Farmer: Sunil Shantha • Agrarian Hub, Bandarawela (3.2 km)</p>
                <p className="text-xs font-extrabold text-amber-400 mt-1">Asking: Rs 220 / kg</p>
              </div>
              <Link to="/marketplace" className="stich-btn-primary text-xs px-3 py-1.5">Negotiate / Order</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. DIVISIONAL AGRARIAN OFFICER ROLE VIEW (Default Executive Overview)
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 stich-card p-6 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-wide">{t('dashboard')}</h1>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Live Telemetry Stream
            </span>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Real-time Bandarawela Upcountry Cultivation Overview & Over-Planting Radar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProxyModalOpen(true)}
            className="stich-btn-primary flex items-center gap-2 text-sm shadow-emerald-700/30"
          >
            <PlusCircle className="w-4 h-4" />
            {t('proxy_entry')}
          </button>
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-900/30 transition"
          >
            <Radio className="w-4 h-4" />
            {t('broadcasts')}
          </button>
        </div>
      </div>

      {/* KPI Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stich-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-400/80 font-bold uppercase tracking-wider">{t('total_farmers')}</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{stats.totalFarmers}</h3>
              <p className="text-[11px] text-emerald-500 mt-1">Bandarawela Agrarian Office</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="stich-card p-5 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-teal-400/80 font-bold uppercase tracking-wider">{t('total_planted_acres')}</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{stats.totalAcres} ac</h3>
              <p className="text-[11px] text-teal-500 mt-1">Logged Planting Acreage</p>
            </div>
            <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400">
              <Sprout className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="stich-card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-400/80 font-bold uppercase tracking-wider">{t('risk_alerts')}</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{stats.highRiskAlerts}</h3>
              <p className="text-[11px] text-red-400 mt-1">Leeks Saturation &gt; 85%</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
          </div>
        </div>

        <div className="stich-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-400/80 font-bold uppercase tracking-wider">{t('active_surplus')}</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{stats.surplusKg.toLocaleString()} kg</h3>
              <p className="text-[11px] text-amber-500 mt-1">Zero-Waste Marketplace</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Regional Crop Saturation Matrix */}
      <div className="stich-card overflow-hidden">
        <div className="p-6 border-b border-emerald-500/20 flex items-center justify-between bg-emerald-950/40">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-extrabold text-white">🌾 Regional Crop Saturation & Over-Planting Risk Matrix</h2>
            </div>
            <p className="text-xs text-emerald-400/70 mt-0.5">
              Evaluated against CROPIX National Market Demand Benchmarks (Bandarawela Division)
            </p>
          </div>
          <Link to="/risk-analytics" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-900/40 px-3 py-1.5 rounded-xl border border-emerald-500/30 transition">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Smart Recommendations <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-emerald-950/80 text-emerald-300/80 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Crop Type</th>
                <th className="px-6 py-4">Planted Area</th>
                <th className="px-6 py-4">Est. Harvest Yield</th>
                <th className="px-6 py-4">CROPIX Quota</th>
                <th className="px-6 py-4">Saturation Gauge</th>
                <th className="px-6 py-4">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-emerald-100">
              {summary.map((item, idx) => (
                <tr key={idx} className="hover:bg-emerald-900/20 transition">
                  <td className="px-6 py-4 font-bold text-white flex items-center space-x-2">
                    <span>{item.crop?.nameEn}</span>
                    <span className="text-xs text-emerald-400/70 font-normal">({item.crop?.nameSi})</span>
                  </td>
                  <td className="px-6 py-4 font-medium">{item.totalPlantedAcres} acres</td>
                  <td className="px-6 py-4 font-medium">{item.estimatedSupplyKg.toLocaleString()} kg</td>
                  <td className="px-6 py-4 font-medium">{item.targetDemandKg.toLocaleString()} kg</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-emerald-950/80 rounded-full h-2.5 overflow-hidden border border-emerald-500/30">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.riskLevel === 'OVER_PLANTED'
                              ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-md shadow-red-500/50'
                              : item.riskLevel === 'WARNING'
                              ? 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-md shadow-amber-500/50'
                              : 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-md shadow-emerald-500/50'
                          }`}
                          style={{ width: `${Math.min(100, item.riskPercentage)}%` }}
                        />
                      </div>
                      <span className="text-xs font-extrabold">{item.riskPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge level={item.riskLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ProxyDataModal isOpen={isProxyModalOpen} onClose={() => setIsProxyModalOpen(false)} onDataAdded={fetchDashboardData} />
      <BroadcastModal isOpen={isBroadcastModalOpen} onClose={() => setIsBroadcastModalOpen(false)} onBroadcastSent={fetchDashboardData} />
    </div>
  );
}
