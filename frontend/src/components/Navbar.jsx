import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { Bell, Globe, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { lang, setLanguage, t } = useContext(LanguageContext);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-3">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-300">
          📍 {t('officer_jurisdiction')}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Trilingual Language Selector */}
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
          <Globe className="w-4 h-4 text-gray-500 ml-1" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 text-xs font-medium rounded ${lang === 'en' ? 'bg-white shadow-sm text-emerald-700 font-bold' : 'text-gray-600'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('si')}
            className={`px-2 py-0.5 text-xs font-medium rounded ${lang === 'si' ? 'bg-white shadow-sm text-emerald-700 font-bold' : 'text-gray-600'}`}
          >
            සිං
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2 py-0.5 text-xs font-medium rounded ${lang === 'ta' ? 'bg-white shadow-sm text-emerald-700 font-bold' : 'text-gray-600'}`}
          >
            தமி
          </button>
        </div>

        {/* User Profile info */}
        <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.full_name ? user.full_name.charAt(0) : 'O'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold text-gray-800">{user?.full_name || 'DO Officer'}</div>
            <div className="text-xs text-gray-500">{user?.role || 'Agrarian Officer'}</div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition"
            title={t('logout')}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
