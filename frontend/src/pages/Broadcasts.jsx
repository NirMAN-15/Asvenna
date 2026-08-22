import React, { useState, useEffect } from 'react';
import API from '../services/api';
import BroadcastModal from '../components/BroadcastModal';
import { PlusCircle } from 'lucide-react';

export default function Broadcasts() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBroadcasts = async () => {
    try {
      const res = await API.get('/broadcasts?district=Badulla');
      setBroadcasts(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📢 Broadcast Warnings History</h1>
          <p className="text-sm text-gray-500">Official Agrarian Officer Notices dispatched to farmers via FCM & SMS.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" /> Issue New Warning
        </button>
      </div>

      <div className="space-y-4">
        {broadcasts.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{b.title_si} / {b.title_en}</h3>
                <p className="text-xs text-gray-500 mt-0.5">By {b.officer_name} • {new Date(b.created_at).toLocaleString()}</p>
              </div>
              <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-lg uppercase">
                {b.severity} Severity
              </span>
            </div>
            <p className="text-xs text-gray-700 mt-3 bg-gray-50 p-3 rounded-xl leading-relaxed">
              {b.message_si}
            </p>
            <div className="mt-3 flex justify-between text-xs text-gray-500 font-medium">
              <span>Target: {b.target_division || 'Entire District'}</span>
              <span>Dispatched to {b.sent_count} Farmers</span>
            </div>
          </div>
        ))}
      </div>

      <BroadcastModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onBroadcastSent={fetchBroadcasts} />
    </div>
  );
}
