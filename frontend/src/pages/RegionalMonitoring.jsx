import React, { useState } from 'react';
import { MapPin, Filter, Layers, Navigation, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function RegionalMonitoring() {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [plantings] = useState([
    { id: 1, farmer_name: 'Sunil Shantha', farmer_phone: '0712345678', land_size_acres: 2.0, planting_date: '2026-08-01', name_en: 'Leeks', name_si: 'ලීක්ස්', division: 'Bandarawela Central', lat: 6.8322, lng: 80.9980, status: 'OVER_PLANTED' },
    { id: 2, farmer_name: 'K. G. Dharmasiri', farmer_phone: '0778899001', land_size_acres: 3.5, planting_date: '2026-08-10', name_en: 'Cabbage', name_si: 'ගෝවා', division: 'Welimada North', lat: 6.9011, lng: 80.9122, status: 'WARNING' },
    { id: 3, farmer_name: 'Nimal Perera', farmer_phone: '0723344556', land_size_acres: 1.5, planting_date: '2026-08-15', name_en: 'Carrot', name_si: 'කැරට්', division: 'Haputale High', lat: 6.7688, lng: 80.9500, status: 'SAFE' },
    { id: 4, farmer_name: 'A. Ramanathan', farmer_phone: '0756677889', land_size_acres: 4.0, planting_date: '2026-08-18', name_en: 'Beetroot', name_si: 'බීට්රූට්', division: 'Ella Division', lat: 6.8667, lng: 81.0467, status: 'SAFE' }
  ]);

  const filteredPlantings = selectedCrop
    ? plantings.filter(p => p.name_en.toLowerCase() === selectedCrop.toLowerCase())
    : plantings;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 stich-card p-6 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-wide">🗺️ Regional Cultivation Heatmap</h1>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            GPS-Tagged Active Planting Plots Across Bandarawela & Upcountry Agrarian Divisions
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
          <Filter className="w-4 h-4 text-emerald-400" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-xs bg-transparent text-emerald-200 focus:outline-none font-semibold"
          >
            <option value="" className="bg-slate-900 text-white">All Crops</option>
            <option value="Leeks" className="bg-slate-900 text-white">Leeks (ලීක්ස්)</option>
            <option value="Cabbage" className="bg-slate-900 text-white">Cabbage (ගෝවා)</option>
            <option value="Carrot" className="bg-slate-900 text-white">Carrot (කැරට්)</option>
            <option value="Beetroot" className="bg-slate-900 text-white">Beetroot (බීට්රූට්)</option>
          </select>
        </div>
      </div>

      {/* Interactive Map Visual Grid */}
      <div className="stich-card p-6 relative overflow-hidden bg-gradient-to-b from-emerald-950/90 to-slate-950">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Bandarawela GPS Grid (Latitude 6.8322° N, Longitude 80.9980° E)</span>
          </div>
          <span className="text-[11px] text-emerald-400/70 bg-emerald-900/30 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            4 Active Regional Clusters
          </span>
        </div>

        {/* Map Plot Pin Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPlantings.map((plot) => (
            <div
              key={plot.id}
              className={`p-4 rounded-xl border transition-all ${
                plot.status === 'OVER_PLANTED'
                  ? 'bg-red-950/40 border-red-500/40 shadow-lg shadow-red-950/50'
                  : plot.status === 'WARNING'
                  ? 'bg-amber-950/40 border-amber-500/40 shadow-lg shadow-amber-950/50'
                  : 'bg-emerald-950/40 border-emerald-500/30 shadow-lg shadow-emerald-950/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {plot.name_en} ({plot.name_si})
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    plot.status === 'OVER_PLANTED'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : plot.status === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {plot.status}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-semibold">{plot.farmer_name}</p>
              <p className="text-[11px] text-emerald-400/70">{plot.division}</p>
              <div className="mt-3 pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300">
                <span>Plot: {plot.land_size_acres} Acres</span>
                <span className="font-mono text-emerald-400">{plot.lat}, {plot.lng}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Plot Log List */}
      <div className="stich-card p-6">
        <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>Recently Registered Regional Planting Records</span>
        </h3>
        <div className="space-y-3">
          {filteredPlantings.map((p) => (
            <div key={p.id} className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-emerald-500/40 transition">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-white text-sm">{p.farmer_name}</h4>
                  <span className="text-xs text-emerald-400/70">({p.farmer_phone})</span>
                </div>
                <p className="text-xs text-emerald-300/80 mt-1">
                  Location: <span className="text-white font-medium">{p.division}</span> • Cultivated: <span className="text-white font-semibold">{p.land_size_acres} Acres</span> • Date: <span className="text-white font-mono">{p.planting_date}</span>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold rounded-xl text-xs">
                  {p.name_en} ({p.name_si})
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-400 hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
