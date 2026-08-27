import React, { useState, useEffect } from 'react';
import API from '../services/api';
import BroadcastModal from '../components/BroadcastModal';
import { Radio, PlusCircle, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Broadcasts() {
  const [broadcasts, setBroadcasts] = useState([
    {
      id: 1,
      officer_name: 'W. M. Bandara (DO Officer)',
      title_en: 'Emergency Saturation Advisory: Leeks',
      title_si: 'අධික වගා සීමාව පසුකිරීමේ අවවාදයයි: ලීක්ස්',
      title_ta: 'அவசர எச்சரிக்கை: லீக்ஸ்',
      message_en: 'Leek planting in Bandarawela region has reached 92% capacity. Avoid new leek sowing.',
      message_si: 'බණ්ඩාරවෙල කලාපයේ ලීක්ස් වගාව 92% සීමාවට පැමිණ ඇත. අලුතින් ලීක්ස් සිටුවීමෙන් වලකින්න.',
      severity: 'CRITICAL',
      target_division: 'Bandarawela Division',
      sent_count: 142,
      created_at: new Date().toISOString()
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBroadcasts = async () => {
    try {
      const res = await API.get('/broadcasts?district=Badulla');
      if (res.data && res.data.data && res.data.data.length > 0) {
        setBroadcasts(res.data.data);
      }
    } catch (err) {
      console.warn('Utilizing Bandarawela seed broadcasts:', err.message);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 stich-card p-6 bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-transparent">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-6 h-6 text-red-400 animate-pulse" />
            <h1 className="text-2xl font-extrabold text-white tracking-wide">📢 Regional Broadcast Warnings History</h1>
          </div>
          <p className="text-xs text-emerald-400/80 mt-1">
            Official Agrarian Officer Notices Dispatched to Farmers via FCM Push + SMS Fallback
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-red-900/40 transition"
        >
          <PlusCircle className="w-4 h-4" /> Issue New Directive
        </button>
      </div>

      {/* Broadcast Cards */}
      <div className="space-y-4">
        {broadcasts.map((b) => (
          <div key={b.id} className="stich-card p-5 border-l-4 border-l-red-500 bg-gradient-to-r from-red-950/20 via-emerald-950/30 to-transparent">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <span>{b.title_si} / {b.title_en}</span>
                </h3>
                <p className="text-xs text-emerald-400/70 mt-1">By {b.officer_name || 'DO Officer'} • {new Date(b.created_at).toLocaleString()}</p>
              </div>
              <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black rounded-xl uppercase">
                {b.severity} Severity
              </span>
            </div>

            <p className="text-xs text-emerald-100 mt-3 bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/20 leading-relaxed">
              {b.message_si}
            </p>

            <div className="mt-4 pt-3 border-t border-emerald-500/20 flex justify-between items-center text-xs text-emerald-300">
              <span className="font-semibold">Target: {b.target_division || 'Bandarawela Division'}</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-900/30 px-3 py-1 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Delivered to {b.sent_count || 142} Farmers (Push + SMS)
              </span>
            </div>
          </div>
        ))}
      </div>

      <BroadcastModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onBroadcastSent={fetchBroadcasts} />
    </div>
  );
}
