import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { MapPin, Filter } from 'lucide-react';

export default function RegionalMonitoring() {
  const [plantings, setPlantings] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');

  useEffect(() => {
    const fetchPlantings = async () => {
      try {
        const res = await API.get(`/planting/regional-map?district=Badulla${selectedCrop ? `&crop_id=${selectedCrop}` : ''}`);
        setPlantings(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlantings();
  }, [selectedCrop]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🗺️ Regional Cultivation Map</h1>
          <p className="text-sm text-gray-500">Live GPS-tagged planting plots across Bandarawela upcountry divisions.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-300">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-xs bg-transparent focus:outline-none"
          >
            <option value="">All Crops</option>
            <option value="1">Leeks</option>
            <option value="2">Cabbage</option>
            <option value="3">Carrot</option>
            <option value="4">Beetroot</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl h-96 relative overflow-hidden shadow-inner flex items-center justify-center p-6 border border-slate-800">
        <div className="text-center text-slate-400">
          <MapPin className="w-12 h-12 mx-auto text-emerald-400 animate-bounce mb-3" />
          <h3 className="text-lg font-bold text-white">Bandarawela Upcountry Agrarian Grid</h3>
          <p className="text-xs max-w-md mx-auto mt-1">
            Displaying GPS cluster points for active planting entries in Bandarawela, Haputale, and Ella Agrarian divisions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Recently Logged Plots ({plantings.length})</h3>
        <div className="space-y-2">
          {plantings.map((p) => (
            <div key={p.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-gray-800">{p.farmer_name}</span>
                <span className="text-gray-500 ml-2">({p.farmer_phone})</span>
                <p className="text-gray-500 mt-0.5">Plot: {p.land_size_acres} Acres • Planted on {new Date(p.planting_date).toLocaleDateString()}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-lg">
                {p.name_en} ({p.name_si})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
