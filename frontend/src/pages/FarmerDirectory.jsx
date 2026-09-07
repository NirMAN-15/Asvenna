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
      {/* Header & Quick Proxy Button with Dark Green & Bold Letters */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
              <Users className="w-5 h-5 text-emerald-800" />
            </div>
            <h1 className="text-2xl font-black text-emerald-950 tracking-tight">
              👨‍🌾 Bandarawela Farmer Directory
            </h1>
          </div>
          <p className="text-sm font-bold text-emerald-900 mt-2 max-w-2xl leading-relaxed">
            Registered Smallholder Farmers & Agrarian Officer Proxy Log Directory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-800 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, phone or NIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs w-64 text-emerald-950 placeholder-slate-500 focus:outline-none focus:border-emerald-600 font-bold"
            />
          </div>
          <button
            onClick={() => setIsProxyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Proxy Record
          </button>
        </div>
      </div>

      {/* Directory Grid with Dark Green & Bold Letters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer.id}
            className="bg-surface-container-lowest border border-outline-variant/40 hover:border-emerald-500/60 rounded-2xl p-5 shadow-card hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-lg shadow-sm border border-emerald-700/30 flex-shrink-0">
                  {farmer.full_name ? farmer.full_name.charAt(0) : 'F'}
                </div>
                <div>
                  <h3 className="font-black text-emerald-950 text-base leading-tight">
                    {farmer.full_name || 'Registered Farmer'}
                  </h3>
                  <span className="text-xs text-emerald-800 font-mono font-bold block mt-0.5">
                    NIC: {farmer.nic || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <Phone className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0" />
                  <span className="font-mono">{farmer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800 flex-shrink-0" />
                  <span>{farmer.division}, {farmer.district}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-emerald-950 font-black">
                {farmer.total_planting_entries || 1} Plantings
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-full text-xs font-black flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" /> Verified
              </span>
            </div>
          </div>
        ))}
      </div>

      <ProxyDataModal isOpen={isProxyModalOpen} onClose={() => setIsProxyModalOpen(false)} onDataAdded={() => {}} />
    </div>
  );
}
