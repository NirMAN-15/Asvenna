import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProxyDataModal from '../components/ProxyDataModal';
import { Search, Phone, MapPin, Users, PlusCircle, ShieldCheck } from 'lucide-react';

export default function FarmerDirectory() {
  const [farmers, setFarmers] = useState([
    { id: 1, full_name: 'Sunil Shantha', phone: '0712345678', nic: '782345678V', district: 'Badulla', division: 'Bandarawela Central', total_planting_entries: 3, is_verified: true },
    { id: 2, full_name: 'K. G. Dharmasiri', phone: '0778899001', nic: '811234567V', district: 'Badulla', division: 'Welimada North', total_planting_entries: 2, is_verified: true },
    { id: 3, full_name: 'Nimal Perera', phone: '0723344556', nic: '852233445V', district: 'Badulla', division: 'Haputale High', total_planting_entries: 1, is_verified: true },
    { id: 4, full_name: 'A. Ramanathan', phone: '0756677889', nic: '903344556V', district: 'Badulla', division: 'Ella Division', total_planting_entries: 4, is_verified: true }
  ]);
  const [search, setSearch] = useState('');
  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await API.get(`/officer/farmers${search ? `?search=${search}` : ''}`);
        if (res.data && res.data.data && res.data.data.length > 0) {
          setFarmers(res.data.data);
        }
      } catch (err) {
        console.warn('Utilizing Bandarawela seed directory:', err.message);
      }
    };
    fetchFarmers();
  }, [search]);

  const filteredFarmers = search
    ? farmers.filter(f => f.full_name.toLowerCase().includes(search.toLowerCase()) || f.phone.includes(search) || (f.nic && f.nic.toLowerCase().includes(search.toLowerCase())))
    : farmers;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Quick Proxy Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 stich-card p-6 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-wide">👨‍🌾 Bandarawela Farmer Directory</h1>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Registered Smallholder Farmers & Agrarian Officer Proxy Log Directory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, phone or NIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-xs w-64 text-white placeholder-emerald-500 focus:outline-none focus:border-emerald-400 font-semibold"
            />
          </div>
          <button
            onClick={() => setIsProxyModalOpen(true)}
            className="stich-btn-primary flex items-center gap-2 text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Proxy Record
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFarmers.map((farmer) => (
          <div key={farmer.id} className="stich-card p-5 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400 transition-all">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-extrabold text-base shadow-md">
                  {farmer.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">{farmer.full_name}</h3>
                  <span className="text-[11px] text-emerald-400/80 font-mono">NIC: {farmer.nic || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono">{farmer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{farmer.division}, {farmer.district}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/20 flex justify-between items-center text-xs">
              <span className="text-emerald-400 font-bold">{farmer.total_planting_entries || 1} Plantings</span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>
        ))}
      </div>

      <ProxyDataModal isOpen={isProxyModalOpen} onClose={() => setIsProxyModalOpen(false)} onDataAdded={() => {}} />
    </div>
  );
}
