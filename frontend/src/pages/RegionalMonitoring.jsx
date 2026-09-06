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
      {/* Page Header with Dark & Bold Letters */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
              <MapPin className="w-5 h-5 text-emerald-800" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              🗺️ Regional Cultivation Heatmap
            </h1>
          </div>
          <p className="text-sm font-bold text-slate-700 mt-2 max-w-2xl leading-relaxed">
            GPS-Tagged Active Planting Plots Across Bandarawela & Upcountry Agrarian Divisions
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 px-3.5 py-2.5 rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-primary/20">
          <Filter className="w-4 h-4 text-slate-600" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-xs bg-transparent text-slate-900 focus:outline-none font-black cursor-pointer"
          >
            <option value="" className="text-slate-900 font-bold">All Crops</option>
            <option value="Leeks" className="text-slate-900 font-bold">Leeks (ලීක්ස්)</option>
            <option value="Cabbage" className="text-slate-900 font-bold">Cabbage (ගෝවා)</option>
            <option value="Carrot" className="text-slate-900 font-bold">Carrot (කැරට්)</option>
            <option value="Beetroot" className="text-slate-900 font-bold">Beetroot (බීට්රූට්)</option>
          </select>
        </div>
      </div>

      {/* Interactive Map Visual Grid with Dark & Bold Letters */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center space-x-2 text-xs font-black text-slate-800">
            <Navigation className="w-4 h-4 text-emerald-700" />
            <span>Bandarawela GPS Grid (Latitude 6.8322° N, Longitude 80.9980° E)</span>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-300 px-3 py-1 rounded-lg">
            4 Active Regional Clusters
          </span>
        </div>

        {/* Map Plot Pin Grid Cards with Dark & Bold Letters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPlantings.map((plot) => (
            <div
              key={plot.id}
              className={`p-4 rounded-xl border transition-all ${
                plot.status === 'OVER_PLANTED'
                  ? 'bg-red-50/90 border-red-200 shadow-xs'
                  : plot.status === 'WARNING'
                  ? 'bg-amber-50/90 border-amber-200 shadow-xs'
                  : 'bg-emerald-50/80 border-emerald-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black flex items-center gap-1 tracking-tight ${
                  plot.status === 'OVER_PLANTED'
                    ? 'text-red-950'
                    : plot.status === 'WARNING'
                    ? 'text-amber-950'
                    : 'text-emerald-950'
                }`}>
                  <MapPin className={`w-3.5 h-3.5 ${
                    plot.status === 'OVER_PLANTED'
                      ? 'text-red-700'
                      : plot.status === 'WARNING'
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`} />
                  {plot.name_en} ({plot.name_si})
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    plot.status === 'OVER_PLANTED'
                      ? 'bg-red-100 text-red-900 border border-red-200'
                      : plot.status === 'WARNING'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {plot.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-900 font-black">{plot.farmer_name}</p>
              <p className="text-xs text-slate-700 font-bold mt-0.5">{plot.division}</p>
              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Plot: {plot.land_size_acres} Acres</span>
                <span className={`font-mono font-black ${
                  plot.status === 'OVER_PLANTED'
                    ? 'text-red-950'
                    : plot.status === 'WARNING'
                    ? 'text-amber-950'
                    : 'text-emerald-950'
                }`}>{plot.lat}, {plot.lng}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Plot Log List with Dark & Bold Letters */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card">
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700" />
          <span>Recently Registered Regional Planting Records</span>
        </h3>
        <div className="space-y-3">
          {filteredPlantings.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-slate-50/90 hover:bg-emerald-50/40 rounded-xl border border-slate-200 hover:border-emerald-300 flex flex-col md:flex-row md:items-center justify-between gap-3 transition shadow-xs"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-black text-slate-900 text-base tracking-wide">{p.farmer_name}</h4>
                  <span className="text-xs font-bold text-slate-600">({p.farmer_phone})</span>
                </div>
                <p className="text-xs font-bold text-slate-700 mt-1 leading-relaxed">
                  Location: <strong className="text-slate-900 font-black">{p.division}</strong> • Cultivated: <strong className="text-slate-900 font-black">{p.land_size_acres} Acres</strong> • Date: <strong className="text-slate-900 font-mono font-bold">{p.planting_date}</strong>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-950 border border-emerald-300 font-black rounded-xl text-xs tracking-wider">
                  {p.name_en} ({p.name_si})
                </span>
                <ChevronRight className="w-4 h-4 text-emerald-700 hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
