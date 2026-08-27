import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  Users, 
  Radio, 
  ShoppingBag, 
  Settings, 
  Sprout 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const getLinksForRole = (role) => {
    switch(role) {
      case 'officer':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/monitoring', label: 'Regional Map', icon: Map },
          { path: '/risk-analytics', label: 'Risk Analytics', icon: BarChart3 },
          { path: '/farmers', label: 'Farmer Directory', icon: Users },
          { path: '/broadcasts', label: 'Broadcasts', icon: Radio },
          { path: '/settings', label: 'Settings', icon: Settings }
        ];
      case 'farmer':
        return [
          { path: '/dashboard', label: 'My Farm', icon: LayoutDashboard },
          { path: '/risk-analytics', label: 'Crop Advice', icon: BarChart3 },
          { path: '/marketplace', label: 'Sell Produce', icon: ShoppingBag },
          { path: '/broadcasts', label: 'Alerts', icon: Radio },
          { path: '/settings', label: 'Settings', icon: Settings }
        ];
      case 'buyer':
        return [
          { path: '/dashboard', label: 'Browse Produce', icon: LayoutDashboard },
          { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
          { path: '/settings', label: 'Settings', icon: Settings }
        ];
      default:
        return [];
    }
  };

  const links = getLinksForRole(user?.role);

  return (
    <aside className="highland-sidebar">
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <Sprout size={32} className="brand-icon" />
        <div className="brand-text">
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>ASVANNA</h1>
          <span className="subtitle" style={{ fontSize: '0.8rem', opacity: 0.8 }}>අස්වැන්න • Crop Balancer</span>
        </div>
      </div>

      <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link, index) => {
          const Icon = link.icon;
          return (
            <NavLink 
              key={index} 
              to={link.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '0.8rem', opacity: 0.7 }}>
        <p>ITUM Moratuwa 2026</p>
      </div>
    </aside>
  );
};

export default Sidebar;
