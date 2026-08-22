import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Users,
  Radio,
  ShoppingBag,
  Settings,
  Sprout
} from 'lucide-react';

export default function Sidebar() {
  const { t } = useContext(LanguageContext);

  const links = [
    { to: '/', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/monitoring', label: t('regional_monitoring'), icon: MapPin },
    { to: '/risk-analytics', label: t('risk_analytics'), icon: AlertTriangle },
    { to: '/farmers', label: t('farmer_directory'), icon: Users },
    { to: '/broadcasts', label: t('broadcasts'), icon: Radio },
    { to: '/marketplace', label: t('marketplace'), icon: ShoppingBag },
    { to: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 space-x-3">
        <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg">
          <Sprout className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-wide text-emerald-400">ASVANNA</h1>
          <p className="text-xs text-slate-400">අස්වැන්න • Agrarian Portal</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">University of Moratuwa</p>
        <p>ITUM Project 2026</p>
      </div>
    </aside>
  );
}
