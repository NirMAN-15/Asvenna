import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import API from '../services/api';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import ProxyDataModal from '../components/ProxyDataModal';
import BroadcastModal from '../components/BroadcastModal';
import { Users, Sprout, AlertTriangle, ShoppingCart, PlusCircle, Radio, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useContext(LanguageContext);
  const [summary, setSummary] = useState([]);
  const [stats, setStats] = useState({
    totalFarmers: 124,
    totalAcres: 84.5,
    highRiskAlerts: 2,
    surplusKg: 4200
  });
  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/risk/regional-summary?district=Badulla');
      setSummary(res.data.data || []);
    } catch (err) {
      console.error('Failed to load risk summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('dashboard')}</h1>
          <p className="text-sm text-gray-500">Real-time Cultivation Overview & Predictive Risk Analysis</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProxyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            {t('proxy_entry')}
          </button>
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
          >
            <Radio className="w-4 h-4" />
            {t('broadcasts')}
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title={t('total_farmers')} value={stats.totalFarmers} subtitle="Bandarawela Division" icon={Users} color="emerald" />
        <StatCard title={t('total_planted_acres')} value={`${stats.totalAcres} ac`} subtitle="Active Season" icon={Sprout} color="blue" />
        <StatCard title={t('risk_alerts')} value={stats.highRiskAlerts} subtitle="Exceeding 85% Demand" icon={AlertTriangle} color="red" />
        <StatCard title={t('active_surplus')} value={`${stats.surplusKg} kg`} subtitle="Marketplace Listings" icon={ShoppingCart} color="amber" />
      </div>

      {/* Regional Crop Supply vs Demand Matrix */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">🌾 Regional Crop Saturation & Risk Status</h2>
            <p className="text-xs text-gray-500">Evaluated against CROPIX National Market Benchmarks</p>
          </div>
          <Link to="/risk-analytics" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View Deep Analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Crop Name</th>
                <th className="px-6 py-3">Planted Acres</th>
                <th className="px-6 py-3">Estimated Supply</th>
                <th className="px-6 py-3">Target Demand</th>
                <th className="px-6 py-3">Saturation (%)</th>
                <th className="px-6 py-3">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {summary.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {item.crop?.nameEn} <span className="text-gray-400 text-xs">({item.crop?.nameSi})</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.totalPlantedAcres} ac</td>
                  <td className="px-6 py-4 text-gray-700">{item.estimatedSupplyKg.toLocaleString()} kg</td>
                  <td className="px-6 py-4 text-gray-700">{item.targetDemandKg.toLocaleString()} kg</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.riskLevel === 'OVER_PLANTED' ? 'bg-red-500' : item.riskLevel === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, item.riskPercentage)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{item.riskPercentage}%</span>
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
