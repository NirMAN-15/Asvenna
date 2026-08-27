import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sprout, ShoppingBag, ChevronRight, Check } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Hero Section */}
      <section className="landing-hero" style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <Sprout size={48} color="#10b981" />
          <h1 style={{ fontSize: '3rem', margin: '0 0 0 15px', color: '#065f46', fontWeight: 'bold' }}>ASVANNA</h1>
        </div>
        <h2 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '15px' }}>Smart Crop Balance & Zero-Waste Marketplace</h2>
        <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '800px', margin: '0 auto' }}>
          Empowering Upcountry Sri Lankan Agriculture — Bandarawela Pilot
        </p>
      </section>

      {/* Cards Section */}
      <section style={{ padding: '60px 20px', flex: 1 }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '30px' 
        }}>
          
          {/* Officer Card */}
          <div className="landing-user-card" style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            padding: '30px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderTop: '5px solid #059669',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Shield size={32} color="#059669" />
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 0 15px', color: '#111827' }}>Divisional Agrarian Officer</h3>
            </div>
            <p style={{ color: '#4b5563', marginBottom: '20px', minHeight: '60px' }}>
              Monitor regional cultivation patterns, issue broadcast alerts, and manage farmer records for the Bandarawela division.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', flex: 1 }}>
              {['Regional Cultivation Heatmap', 'CROPIX Risk Analytics', 'Farmer Directory & Proxy Entry', 'Emergency Broadcast System'].map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: '#374151' }}>
                  <Check size={18} color="#059669" style={{ marginRight: '10px' }} />
                  {feature}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => handleNavigation('/auth/officer')}
                style={{ flex: 1, padding: '10px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Register
              </button>
              <button 
                onClick={() => handleNavigation('/auth/officer')}
                style={{ flex: 1, padding: '10px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Sign In <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Farmer Card */}
          <div className="landing-user-card" style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            padding: '30px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderTop: '5px solid #10b981',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <Sprout size={32} color="#10b981" />
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 0 15px', color: '#111827' }}>Upcountry Farmer</h3>
            </div>
            <p style={{ color: '#4b5563', marginBottom: '20px', minHeight: '60px' }}>
              Log your crops, receive smart planting recommendations, and sell surplus produce to local buyers within 5km.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', flex: 1 }}>
              {['Smart Crop Recommendations', 'Over-planting Alerts', 'Surplus Produce Listing', 'Direct Buyer Chat'].map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: '#374151' }}>
                  <Check size={18} color="#10b981" style={{ marginRight: '10px' }} />
                  {feature}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => handleNavigation('/auth/farmer')}
                style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Register
              </button>
              <button 
                onClick={() => handleNavigation('/auth/farmer')}
                style={{ flex: 1, padding: '10px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Sign In <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Buyer Card */}
          <div className="landing-user-card" style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            padding: '30px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderTop: '5px solid #d97706',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <ShoppingBag size={32} color="#d97706" />
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 0 15px', color: '#111827' }}>Local Buyer</h3>
            </div>
            <p style={{ color: '#4b5563', marginBottom: '20px', minHeight: '60px' }}>
              Discover fresh surplus produce near you, negotiate prices directly with farmers, and reduce post-harvest waste.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', flex: 1 }}>
              {['5km Proximity Search', 'Direct Farmer Negotiation', 'Real-time Order Tracking', 'Wholesale & Retail Options'].map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: '#374151' }}>
                  <Check size={18} color="#d97706" style={{ marginRight: '10px' }} />
                  {feature}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => handleNavigation('/auth/buyer')}
                style={{ flex: 1, padding: '10px', backgroundColor: '#d97706', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Register
              </button>
              <button 
                onClick={() => handleNavigation('/auth/buyer')}
                style={{ flex: 1, padding: '10px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Sign In <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '30px 20px', textAlign: 'center', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', color: '#6b7280', marginTop: 'auto' }}>
        <p style={{ margin: 0 }}>ASVANNA — ITUM University of Moratuwa © 2026 • Bandarawela Upcountry Pilot</p>
      </footer>

    </div>
  );
};

export default LandingPage;
