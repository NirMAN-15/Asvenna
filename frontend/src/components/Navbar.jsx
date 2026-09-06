import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

export default function Navbar() {
  const { user, role, logout } = useContext(AuthContext);
  const { lang, setLanguage, t } = useContext(LanguageContext);
  const navigate = useNavigate();

  // 15-minute session timer simulation (from Stitch Officer Dashboard)
  const [secondsLeft, setSecondsLeft] = useState(899); // 14:59

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleTitle = () => {
    const r = role?.toUpperCase();
    if (r === 'OFFICER') return `${user?.full_name || 'Officer N. Perera'}`;
    if (r === 'FARMER') return `${user?.full_name || 'Farmer Ramesh Bandara'}`;
    if (r === 'BUYER') return `${user?.business_name || user?.full_name || 'Local Buyer Partner'}`;
    return user?.full_name || 'ASVANNA Stakeholder';
  };

  const getOfficeSubtitle = () => {
    const r = role?.toUpperCase();
    if (r === 'OFFICER') return `${user?.division || 'Bandarawela'} District Agrarian Office`;
    if (r === 'FARMER') return `${user?.division || 'Bandarawela'} • Upcountry Cultivation Division`;
    if (r === 'BUYER') return `${user?.district || 'Badulla'} Commercial Surplus Procurement`;
    return 'Bandarawela Agricultural Zone';
  };

  return (
    <header className="sticky top-0 right-0 left-0 h-20 bg-surface-bright/95 backdrop-blur-md shadow-sm flex justify-between items-center px-4 md:px-8 z-20 border-b border-outline-variant/30 flex-shrink-0">
      {/* Title & Division Info with Mobile Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/dashboard" className="md:hidden flex-shrink-0">
          <img
            src="/logo.png"
            alt="ASVANNA"
            className="w-10 h-10 object-contain rounded-full shadow-sm filter drop-shadow-xs"
          />
        </Link>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-headline text-lg md:text-xl font-bold text-primary truncate">
              {getRoleTitle()}
            </h2>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-secondary-container text-on-secondary-fixed flex-shrink-0">
              {role || 'VERIFIED'}
            </span>
          </div>
          <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider truncate">
            {getOfficeSubtitle()}
          </p>
        </div>
      </div>

      {/* Right Controls: Timer, Language, Notifications, Avatar */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* JWT Countdown Timer Pill (Stitch Anchor Component) */}
        <div className="hidden sm:flex items-center bg-surface-container px-3.5 py-1.5 rounded-full border border-outline-variant shadow-sm">
          <span className="material-symbols-outlined text-primary mr-1.5 text-base icon-fill">
            timer
          </span>
          <span className="font-label-md font-bold text-primary text-xs tracking-wider">
            {formatTimer()}
          </span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 border border-outline-variant text-xs shadow-sm">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded-full font-bold transition ${
              lang === 'en' ? 'bg-secondary-container text-on-secondary-fixed' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            EN
          </button>
          <div className="w-px h-3 bg-outline-variant mx-0.5" />
          <button
            onClick={() => setLanguage('si')}
            className={`px-2 py-0.5 rounded-full font-bold transition ${
              lang === 'si' ? 'bg-secondary-container text-on-secondary-fixed' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            සිං
          </button>
          <div className="w-px h-3 bg-outline-variant mx-0.5" />
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2 py-0.5 rounded-full font-bold transition ${
              lang === 'ta' ? 'bg-secondary-container text-on-secondary-fixed' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            த
          </button>
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative cursor-pointer hover:scale-105 transition-transform p-1">
          <span className="material-symbols-outlined text-on-surface-variant text-[26px]">
            notifications
          </span>
          <span className="absolute top-0 right-0 w-4 h-4 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
            3
          </span>
        </div>

        {/* Avatar with Ring */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold overflow-hidden ring-2 ring-primary ring-offset-2 shadow-sm">
            {user?.photo ? (
              <img src={user.photo} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center text-xs text-on-surface-variant hover:text-error transition ml-1"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
