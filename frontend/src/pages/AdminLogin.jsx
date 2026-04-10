import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const result = await login(email, password);
            if (result.success) {
                const userString = localStorage.getItem('skyway_user');
                if (userString) {
                    const user = JSON.parse(userString);
                    if (user.role === 'admin') {
                        navigate('/admin');
                        return;
                    } else {
                        setError('Access Denied: This portal is for administrators only.');
                    }
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('System error. Please contact IT support.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page" style={{ 
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0a0e27', padding: '1rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Staff Portal</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Authorized Personnel Only</p>
                </div>

                {error && (
                    <div style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem',
                        fontSize: '0.85rem', textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>ADMIN EMAIL</label>
                        <input type="email" className="form-input" placeholder="admin@skyway.com"
                            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                            value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    
                    <div className="form-group">
                        <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>SECURE PASSWORD</label>
                        <input type="password" className="form-input" placeholder="••••••••"
                            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                            value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ 
                        width: '100%', marginTop: '1rem', padding: '1rem',
                        background: 'linear-gradient(45deg, #4f46e5, #3b82f6)',
                        boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)'
                    }}>
                        {loading ? 'Authenticating...' : 'Secure Login →'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#10b981' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                        System Status: All Systems Operational
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        <strong>IT Support:</strong> ext. 4200 | <a href="mailto:it-support@skyway.com" style={{ color: '#3b82f6', textDecoration: 'none' }}>it-support@skyway.com</a><br/>
                        <em>v2.4.1 — Restricted Access</em>
                    </p>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
                        ← Return to Customer Site
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .admin-login-page label { display: block; margin-bottom: 0.5rem; font-weight: 600; letter-spacing: 0.5px; }
            `}</style>
        </div>
    );
}
