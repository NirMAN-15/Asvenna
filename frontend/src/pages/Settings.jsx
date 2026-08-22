import React from 'react';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">⚙️ Agrarian Portal Settings</h1>
        <p className="text-sm text-gray-500">Configure risk calculation thresholds and CROPIX sync intervals.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 text-sm">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Safe Planting Threshold (%)</label>
          <input type="number" defaultValue={70} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Over-Planting Critical Threshold (%)</label>
          <input type="number" defaultValue={85} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Marketplace Geofence Radius (km)</label>
          <input type="number" defaultValue={5.0} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <button className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg">Save Settings</button>
      </div>
    </div>
  );
}
