import React, { useContext, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export default function Settings() {
  const { t } = useContext(LanguageContext);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('settings_title')}</h1>
        <p className="text-sm text-gray-500">{t('settings_desc')}</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4 text-sm">
        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
            <span>✓</span> {t('settings_saved_toast')}
          </div>
        )}

        <div>
          <label className="block font-semibold text-gray-700 mb-1">{t('safe_planting_threshold')}</label>
          <input type="number" defaultValue={70} className="w-full px-3 py-2 border rounded-lg focus:border-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">{t('overplanting_critical_threshold')}</label>
          <input type="number" defaultValue={85} className="w-full px-3 py-2 border rounded-lg focus:border-emerald-500 outline-none" />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">{t('marketplace_geofence_radius')}</label>
          <input type="number" defaultValue={5.0} step="0.5" className="w-full px-3 py-2 border rounded-lg focus:border-emerald-500 outline-none" />
        </div>
        <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 transition text-white font-semibold rounded-lg shadow-sm cursor-pointer">
          {t('btn_save_settings')}
        </button>
      </form>
    </div>
  );
}
