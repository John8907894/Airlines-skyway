import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        dob: '',
        nationality: 'Indian',
        passport: '',
    });
    const [notifications, setNotifications] = useState({
        email: true, sms: false, offers: true, reminders: true,
    });

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1>⚙️ Settings</h1>
                <p>Manage your account preferences and profile details.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Profile */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        👤 Profile Information
                    </h3>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input className="form-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input className="form-input" type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input className="form-input" type="tel" placeholder="+91 98765 43210" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input className="form-input" type="date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Nationality</label>
                            <select className="form-select" value={profile.nationality} onChange={e => setProfile({ ...profile, nationality: e.target.value })}>
                                <option>Indian</option>
                                <option>American</option>
                                <option>British</option>
                                <option>Australian</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Passport Number (Optional)</label>
                            <input className="form-input" placeholder="A12345678" value={profile.passport} onChange={e => setProfile({ ...profile, passport: e.target.value })} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            {saved ? '✓ Saved Successfully!' : 'Save Profile'}
                        </button>
                    </form>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Notifications */}
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🔔 Notifications
                        </h3>
                        {Object.entries(notifications).map(([key, val]) => (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{key === 'sms' ? 'SMS' : key.charAt(0).toUpperCase() + key.slice(1)} Notifications</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        {key === 'email' && 'Receive booking confirmations via email'}
                                        {key === 'sms' && 'Receive flight updates via SMS'}
                                        {key === 'offers' && 'Get exclusive deals and promotions'}
                                        {key === 'reminders' && 'Flight departure and check-in reminders'}
                                    </div>
                                </div>
                                <div
                                    onClick={() => setNotifications({ ...notifications, [key]: !val })}
                                    style={{ width: '48px', height: '26px', borderRadius: '13px', background: val ? 'var(--accent-primary)' : '#cbd5e1', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                                >
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: val ? '24px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Security  */}
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🔒 Security
                        </h3>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input className="form-input" type="password" placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input className="form-input" type="password" placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input className="form-input" type="password" placeholder="••••••••" />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }}>Update Password</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
