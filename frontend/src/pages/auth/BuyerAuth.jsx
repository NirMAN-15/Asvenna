import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ShoppingBag } from 'lucide-react';

const BuyerAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // Fallback if context is not yet fully provided
    const authContext = useContext(AuthContext);
    const login = authContext?.login || (async () => {});
    const register = authContext?.register || (async () => {});

    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        contactPersonName: '',
        nic: '',
        businessType: 'Wholesale',
        district: 'Badulla'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.phone, formData.password, 'BUYER');
                navigate('/dashboard');
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                const registerData = { ...formData };
                delete registerData.confirmPassword;
                await register(registerData, 'BUYER');
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const accentColor = '#F59E0B';

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ borderTop: `4px solid ${accentColor}` }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <ShoppingBag size={48} color={accentColor} style={{ margin: '0 auto' }} />
                    <h2 style={{ color: accentColor, marginTop: '10px' }}>Buyer Marketplace Portal</h2>
                </div>
                
                <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
                    <button 
                        style={{ 
                            flex: 1, padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer',
                            backgroundColor: isLogin ? accentColor : '#eee', 
                            color: isLogin ? '#fff' : '#333' 
                        }}
                        onClick={() => { setIsLogin(true); setError(''); }}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button 
                        style={{ 
                            flex: 1, padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer',
                            backgroundColor: !isLogin ? accentColor : '#eee', 
                            color: !isLogin ? '#fff' : '#333' 
                        }}
                        onClick={() => { setIsLogin(false); setError(''); }}
                        type="button"
                    >
                        Register
                    </button>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label>Business Name</label>
                                <input type="text" name="businessName" className="highland-input" value={formData.businessName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Contact Person Name</label>
                                <input type="text" name="contactPersonName" className="highland-input" value={formData.contactPersonName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>NIC</label>
                                <input type="text" name="nic" className="highland-input" value={formData.nic} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Business Type</label>
                                <select name="businessType" className="highland-input" value={formData.businessType} onChange={handleChange} required>
                                    <option value="Wholesale">Wholesale</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Restaurant">Restaurant</option>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Export">Export</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>District</label>
                                <select name="district" className="highland-input" value={formData.district} onChange={handleChange} required>
                                    <option value="Badulla">Badulla</option>
                                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                                    <option value="Matale">Matale</option>
                                    <option value="Kandy">Kandy</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" className="highland-input" value={formData.phone} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" className="highland-input" value={formData.password} onChange={handleChange} required />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" className="highland-input" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="highland-btn-primary" 
                        disabled={loading} 
                        style={{ width: '100%', marginTop: '15px', backgroundColor: accentColor, borderColor: accentColor }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Link to="/" style={{ color: accentColor, textDecoration: 'none' }}>&larr; Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default BuyerAuth;
