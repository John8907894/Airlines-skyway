import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [tab, setTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/search');
        } else {
            setError(result.message);
        }
    };

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setSuccess('');
        if (regPassword !== regConfirm) {
            setError('Passwords do not match.');
            return;
        }
        if (regPassword.length < 4) {
            setError('Password must be at least 4 characters.');
            return;
        }
        const result = await register(name, regEmail, regPassword);
        if (result.success) {
            setSuccess('Account created! Signing you in...');
            setTimeout(() => navigate('/search'), 1000);
        } else {
            setError(result.message);
        }
    };



    return (
        <div className="login-page">
            {/* Animated floating planes */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                {['5%', '25%', '55%', '75%', '90%'].map((top, i) => (
                    <div key={i} style={{
                        position: 'absolute', top, left: '-60px', fontSize: `${1.2 + i * 0.4}rem`,
                        animation: `floatAcross ${10 + i * 4}s linear ${i * 2}s infinite`, opacity: 0.12
                    }}>✈️</div>
                ))}
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%', maxWidth: '960px', minHeight: '560px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
                {/* Left Panel */}
                <div style={{
                    flex: '1', background: 'linear-gradient(145deg, #0c1445 0%, #1a237e 40%, #283593 100%)',
                    padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(99,179,237,0.08)' }} />
                    <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(99,179,237,0.06)' }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                            <span style={{ fontSize: '2.2rem' }}>✈️</span>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>SkyWay</div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '2px' }}>AIRLINES</div>
                            </div>
                        </div>

                        <h2 style={{ color: '#fff', fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
                            Your dream<br />destination awaits
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                            Book flights, hotels & resorts across India and beyond — all in one place.
                        </p>

                        {[
                            { icon: '⚡', title: 'Instant Booking', desc: 'Book in under 3 minutes' },
                            { icon: '🔒', title: 'Secure Payments', desc: 'Card, UPI, Bank Transfer' },
                            { icon: '🤖', title: '24/7 AI Support', desc: 'Always here to help' },
                            { icon: '🏆', title: 'Rewards Points', desc: 'Earn on every booking' },
                        ].map((f, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{f.icon}</div>
                                <div>
                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{f.title}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem' }}>{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', position: 'relative', zIndex: 1 }}>
                        © 2026 SkyWay Airlines. All rights reserved.
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{ flex: '1', background: 'var(--bg-primary)', padding: '3rem 2.5rem', overflowY: 'auto' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', background: 'var(--bg-glass)', borderRadius: '12px', padding: '4px', marginBottom: '2rem', border: '1px solid var(--border-glass)' }}>
                        {['login', 'register'].map(t => (
                            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                                style={{
                                    flex: 1, padding: '0.65rem', borderRadius: '9px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                                    background: tab === t ? 'var(--accent-gradient)' : 'transparent',
                                    color: tab === t ? '#fff' : 'var(--text-muted)', border: 'none', transition: 'all 0.25s'
                                }}>
                                {t === 'login' ? '🔑 Sign In' : '✨ Register'}
                            </button>
                        ))}
                    </div>

                    {error && <div className="login-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                    {success && <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.88rem' }}>{success}</div>}

                    {tab === 'login' ? (
                        <>
                            <h3 style={{ marginBottom: '0.25rem', fontSize: '1.35rem', fontWeight: 800 }}>Welcome back!</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>Sign in to continue your journey</p>

                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label>📧 Email Address</label>
                                    <input type="email" className="form-input" placeholder="Enter your email"
                                        value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label>🔒 Password</label>
                                    <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="Enter your password"
                                        value={password} onChange={e => setPassword(e.target.value)} required />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        style={{ position: 'absolute', right: '0.75rem', bottom: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' }}>
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}>
                                    Sign In →
                                </button>
                            </form>


                        </>
                    ) : (
                        <>
                            <h3 style={{ marginBottom: '0.25rem', fontSize: '1.35rem', fontWeight: 800 }}>Create Account</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>Join SkyWay and start earning rewards</p>

                            <form onSubmit={handleRegister}>
                                <div className="form-group">
                                    <label>👤 Full Name</label>
                                    <input type="text" className="form-input" placeholder="e.g. Rahul Sharma"
                                        value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>📧 Email Address</label>
                                    <input type="email" className="form-input" placeholder="you@email.com"
                                        value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>🔒 Password</label>
                                    <input type="password" className="form-input" placeholder="Minimum 4 characters"
                                        value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>🔒 Confirm Password</label>
                                    <input type="password" className="form-input" placeholder="Repeat password"
                                        value={regConfirm} onChange={e => setRegConfirm(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}>
                                    Create Account ✨
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                                    By registering you earn 500 welcome points 🏆
                                </p>
                            </form>
                        </>
                    )}
                    

                </div>
            </div>

            <style>{`
                @keyframes floatAcross {
                    from { transform: translateX(-60px) translateY(0); }
                    50% { transform: translateX(50vw) translateY(-15px); }
                    to { transform: translateX(110vw) translateY(0); }
                }
            `}</style>
        </div>
    );
}
