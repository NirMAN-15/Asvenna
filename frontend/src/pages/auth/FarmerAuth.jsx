import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Sprout } from 'lucide-react';

const FarmerAuth = () => {
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
        fullName: '',
        nic: '',
        district: 'Badulla',
        division: '',
        gndDivision: '',
        landSize: ''
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
                await login(formData.phone, formData.password, 'FARMER');
                navigate('/dashboard');
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                const registerData = { ...formData };
                delete registerData.confirmPassword;
                // Convert landSize to number if needed
                if (registerData.landSize) {
                    registerData.landSize = Number(registerData.landSize);
                }
                await register(registerData, 'FARMER');
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const accentColor = '#22C55E';

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ borderTop: `4px solid ${accentColor}` }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Sprout size={48} color={accentColor} style={{ margin: '0 auto' }} />
                    <h2 style={{ color: accentColor, marginTop: '10px' }}>Farmer Portal — අස්වැන්න</h2>
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
                                <label>Full Name</label>
                                <input type="text" name="fullName" className="highland-input" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>NIC</label>
                                <input type="text" name="nic" className="highland-input" value={formData.nic} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>District</label>
                                <select name="district" className="highland-input" value={formData.district} onChange={handleChange} required>
                                    <option value="Badulla">Badulla</option>
                                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                                    <option value="Matale">Matale</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Division</label>
                                <input type="text" name="division" className="highland-input" value={formData.division} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>GND Division</label>
                                <input type="text" name="gndDivision" className="highland-input" value={formData.gndDivision} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Land Size in Acres</label>
                                <input type="number" step="0.01" name="landSize" className="highland-input" value={formData.landSize} onChange={handleChange} required />
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

export default FarmerAuth;
