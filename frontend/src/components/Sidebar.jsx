import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleLinks = () => {
    const r = role?.toUpperCase();
    if (r === 'OFFICER') {
      return [
        { path: '/dashboard', label: 'Field Overview', icon: 'agriculture' },
        { path: '/monitoring', label: 'Regional Map', icon: 'map' },
        { path: '/risk-analytics', label: 'Risk Analytics', icon: 'bar_chart' },
        { path: '/farmers', label: 'Farmer Directory', icon: 'group' },
        { path: '/broadcasts', label: 'Advisory Broadcasts', icon: 'campaign' },
        { path: '/settings', label: 'Settings', icon: 'settings' },
      ];
    } else if (r === 'FARMER') {
      return [
        { path: '/dashboard', label: 'My Farm Overview', icon: 'agriculture' },
        { path: '/risk-analytics', label: 'Crop Advisory', icon: 'psychology' },
        { path: '/marketplace', label: 'Sell Surplus Produce', icon: 'storefront' },
        { path: '/broadcasts', label: 'Officer Alerts', icon: 'notifications_active' },
        { path: '/settings', label: 'Settings', icon: 'settings' },
      ];
    } else if (r === 'BUYER') {
      return [
        { path: '/dashboard', label: 'Procurement Dashboard', icon: 'dashboard' },
        { path: '/marketplace', label: 'Surplus Marketplace', icon: 'shopping_cart' },
        { path: '/settings', label: 'Settings', icon: 'settings' },
      ];
    }
    return [
      { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
      { path: '/marketplace', label: 'Marketplace', icon: 'shopping_cart' },
    ];
  };

  const links = getRoleLinks();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 flex-shrink-0 bg-surface-container-low border-r border-outline-variant z-30 select-none">
      {/* Brand Header with Project Logo */}
      <div className="px-5 py-5 border-b border-outline-variant/30">
        <NavLink to="/dashboard" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="ASVANNA Logo"
            className="w-11 h-11 object-contain rounded-full shadow-md filter drop-shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-headline text-lg font-extrabold text-primary leading-none tracking-tight">ASVANNA</h1>
              <span className="text-[10px] font-bold text-secondary bg-secondary-container/60 px-1.5 py-0.2 rounded">SL</span>
            </div>
            <p className="text-on-surface-variant text-[11px] font-semibold tracking-wider uppercase mt-1 truncate">
              Agri Intelligence
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl font-label-md text-label-md transition-all duration-150 ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-fixed font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-variant/70 hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined mr-3 text-xl ${
                    isActive ? 'icon-fill text-primary' : 'text-outline'
                  }`}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Support & Sign Out */}
      <div className="p-4 border-t border-outline-variant/30 space-y-1 bg-surface-container-lowest/50">
        <button
          onClick={() => alert('Bandarawela Agrarian Advisory Support: 1920\nTechnical Help: help@asvanna.gov.lk')}
          className="text-on-surface-variant flex items-center px-4 py-2.5 hover:bg-surface-variant transition rounded-xl w-full text-left font-medium text-sm"
        >
          <span className="material-symbols-outlined mr-3 text-xl text-outline">help</span>
          <span className="font-label-md">Help Center</span>
        </button>

        <button
          onClick={handleLogout}
          className="text-error hover:bg-error-container/20 flex items-center px-4 py-2.5 transition rounded-xl w-full text-left font-semibold text-sm"
        >
          <span className="material-symbols-outlined mr-3 text-xl">logout</span>
          <span className="font-label-md">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
