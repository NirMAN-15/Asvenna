import React from 'react';
import { Tag, MapPin } from 'lucide-react';

export default function MarketplaceSurplus() {
  const dummySurplus = [
    { id: 1, crop: 'Leeks (ලීක්ස්)', farmer: 'Chaminda Silva', quantity: '450 kg', price: 'Rs. 240/kg', distance: '1.8 km away', status: 'Available' },
    { id: 2, crop: 'Cabbage (ගෝවා)', farmer: 'Kapila Bandara', quantity: '800 kg', price: 'Rs. 160/kg', distance: '3.2 km away', status: 'Available' },
    { id: 3, crop: 'Carrot (කැරට්)', farmer: 'Nimal Jayasinghe', quantity: '320 kg', price: 'Rs. 290/kg', distance: '4.1 km away', status: 'Reserved' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🛒 Zero-Waste Surplus Marketplace (Phase 2)</h1>
        <p className="text-sm text-gray-500">Geo-fenced 5 km direct farmer-to-buyer surplus trade portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dummySurplus.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 text-base">{item.crop}</h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Farmer: {item.farmer}</p>

              <div className="mt-4 space-y-2 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-sm text-gray-900">{item.price}</span>
                  <span className="text-gray-500">({item.quantity} available)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{item.distance} (Bandarawela)</span>
                </div>
              </div>
            </div>

            <button className="mt-5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition">
              Direct Negotiation / Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
