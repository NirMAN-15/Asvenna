import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Phone, MapPin } from 'lucide-react';

export default function FarmerDirectory() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await API.get(`/officer/farmers${search ? `?search=${search}` : ''}`);
        setFarmers(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFarmers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">👨‍🌾 Farmer Directory</h1>
          <p className="text-sm text-gray-500">Registered farmers in Bandarawela Agrarian Division</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, phone or NIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs w-72 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {farmers.map((farmer) => (
          <div key={farmer.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {farmer.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{farmer.full_name}</h3>
                  <span className="text-xs text-gray-500">NIC: {farmer.nic || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{farmer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{farmer.division}, {farmer.district}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-emerald-700 font-semibold">{farmer.total_planting_entries || 0} Cultivations</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
