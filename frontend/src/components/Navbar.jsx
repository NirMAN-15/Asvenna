import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { Sun, Moon, LogOut, User, Globe } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'officer': return 'role-badge-officer';
      case 'farmer': return 'role-badge-farmer';
      case 'buyer': return 'role-badge-buyer';
      default: return '';
    }
  };

  return (
    <nav className="highland-navbar">
      <div className="navbar-left">
        {/* Mobile menu toggle could go here */}
      </div>
      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && user.role && (
          <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        )}
        
        <div className="language-switcher" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Globe size={18} />
          <button onClick={() => setLanguage('en')} className={language === 'en' ? 'active' : ''}>EN</button>
          <button onClick={() => setLanguage('si')} className={language === 'si' ? 'active' : ''}>සිං</button>
          <button onClick={() => setLanguage('ta')} className={language === 'ta' ? 'active' : ''}>தமி</button>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user && (
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="avatar-circle" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={18} />}
            </div>
            <span className="user-name">{user.full_name || 'User'}</span>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout} aria-label="Logout" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
