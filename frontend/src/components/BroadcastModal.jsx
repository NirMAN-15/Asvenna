import React, { useState } from 'react';
import API from '../services/api';
import { X, Send, Radio, AlertCircle } from 'lucide-react';

export default function BroadcastModal({ isOpen, onClose, onBroadcastSent }) {
  const [formData, setFormData] = useState({
    title_en: 'Over-Planting Alert: Leeks',
    title_si: 'අධික වගා අනතුරු ඇඟවීම: ලීක්ස්',
    title_ta: 'அதிக நடவு எச்சரிக்கை: லீக்ஸ்',
    message_en: 'Current regional leeks cultivation has exceeded 85% of market demand. Please consider alternative crops like Beetroot or Knol Khol.',
    message_si: 'බණ්ඩාරවෙල කලාපයේ ලීක්ස් වගාව වෙළඳපල ඉල්ලුමෙන් 85% ඉක්මවා ඇත. කරුණාකර බීට්රූට් හෝ නෝකෝල් වගා කිරීමට සලකා බලන්න.',
    message_ta: 'பண்டாரவளையில் லீக்ஸ் பயிர்ச்செய்கை 85% ஐ தாண்டியுள்ளது. தயவுசெய்து மாற்று பயிர்களை பரிசீலிக்கவும்.',
    target_district: 'Badulla',
    target_division: 'Bandarawela',
    severity: 'HIGH'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/broadcasts', formData);
      onBroadcastSent();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch broadcast.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <Radio className="w-5 h-5 text-red-600 animate-pulse" /> Broadcast Regional Warning
        </h2>
        <p className="text-xs text-gray-500 mb-4">Dispatches Push Notification (FCM) & SMS to all registered farmers.</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Sinhala Title & Message (ප්‍රධාන)</label>
            <input
              type="text"
              required
              value={formData.title_si}
              onChange={(e) => setFormData({ ...formData, title_si: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg mb-2 text-sm"
            />
            <textarea
              rows={2}
              required
              value={formData.message_si}
              onChange={(e) => setFormData({ ...formData, message_si: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">English Translation</label>
            <input
              type="text"
              required
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg mb-2 text-sm"
            />
            <textarea
              rows={2}
              required
              value={formData.message_en}
              onChange={(e) => setFormData({ ...formData, message_en: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Severity Level</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="LOW">Low (Advisory)</option>
                <option value="MEDIUM">Medium (Caution)</option>
                <option value="HIGH">High (At-Risk)</option>
                <option value="CRITICAL">Critical (Over-Planted)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Division</label>
              <input
                type="text"
                value={formData.target_division}
                onChange={(e) => setFormData({ ...formData, target_division: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Broadcast to All Farmers'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
