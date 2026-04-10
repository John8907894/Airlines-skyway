import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const INITIAL_FLIGHTS = [
    { id: 'SK101', from: 'Delhi (DEL)', to: 'Mumbai (BOM)', dep: '06:00', arr: '08:20', price: 4200, status: 'Active' },
    { id: 'SK202', from: 'Mumbai (BOM)', to: 'Chennai (MAA)', dep: '10:30', arr: '12:45', price: 3800, status: 'Active' },
    { id: 'SK303', from: 'Bangalore (BLR)', to: 'Kolkata (CCU)', dep: '14:00', arr: '17:30', price: 5100, status: 'Active' },
    { id: 'SK404', from: 'Hyderabad (HYD)', to: 'Pune (PNQ)', dep: '08:15', arr: '09:50', price: 2900, status: 'Delayed' },
];

const INITIAL_HOTELS = [
    { id: 1, name: 'The Grand Palace Hotel', city: 'Mumbai', price: 4500, rating: 4.8, status: 'Active' },
    { id: 2, name: 'Sea Breeze Resort', city: 'Goa', price: 3200, rating: 4.6, status: 'Active' },
    { id: 3, name: 'Heritage Palace Inn', city: 'Jaipur', price: 2800, rating: 4.7, status: 'Active' },
    { id: 4, name: 'Himalayan View Lodge', city: 'Manali', price: 2200, rating: 4.5, status: 'Seasonal' },
];

const INITIAL_OFFERS = [
    { id: 1, code: 'EARLY30', type: 'Flight', discount: '30%', validTill: '2026-04-30', active: true },
    { id: 2, code: 'WKND999', type: 'Flight', discount: '₹999', validTill: '2026-03-31', active: true },
    { id: 3, code: 'HOTEL10', type: 'Hotel', discount: '10%', validTill: '2026-06-30', active: true },
    { id: 4, code: 'RESORT20', type: 'Hotel', discount: '20%', validTill: '2026-05-31', active: false },
    { id: 5, code: 'FIRST15', type: 'Both', discount: '15%', validTill: '2026-12-31', active: true },
];

export default function Admin() {
    const { isAdmin, token } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const getInitialTab = () => {
        const hash = location.hash.replace('#', '');
        return ['dashboard', 'flights', 'hotels', 'users', 'offers', 'reports', 'settings', 'help'].includes(hash) ? hash : 'dashboard';
    };
    
    const [activeTab, setActiveTab] = useState(getInitialTab());

    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (['dashboard', 'flights', 'hotels', 'users', 'offers', 'reports', 'settings', 'help'].includes(hash)) {
            setActiveTab(hash);
        } else if (!hash) {
            setActiveTab('dashboard');
        }
    }, [location.hash]);
    const [flights, setFlights] = useState(INITIAL_FLIGHTS);
    const [hotels, setHotels] = useState(INITIAL_HOTELS);
    const [offers, setOffers] = useState(INITIAL_OFFERS);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);

    // Flight form
    const [newFlight, setNewFlight] = useState({ id: '', from: '', to: '', dep: '', arr: '', price: '', status: 'Active' });
    const [editFlightId, setEditFlightId] = useState(null);

    // Offer/User forms
    const [newOffer, setNewOffer] = useState({ code: '', type: 'Flight', discount: '', validTill: '' });
    const [userModal, setUserModal] = useState({ open: false, type: 'add', data: { name: '', email: '', password: '', role: 'user' } });

    useEffect(() => {
        if (isAdmin && token) {
            fetchStats();
            fetchRealFlights();
            fetchRealHotels();
            fetchUsers();
        }
    }, [isAdmin, token]);

    const fetchStats = async () => {
        try {
            const data = await api.getAdminStats(token);
            if (data.totalBookings !== undefined) {
                setStats(data);
            }
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        }
    };

    const fetchRealFlights = async () => {
        try {
            const data = await api.getFlights();
            if (Array.isArray(data)) {
                // Map backend flightNumber to id for consistency in admin table
                setFlights(data.map(f => ({ ...f, id: f.flightNumber || f._id })));
            }
        } catch (err) {
            console.error('Failed to fetch flights:', err);
        }
    };

    const fetchRealHotels = async () => {
        try {
            const data = await api.getHotels();
            if (Array.isArray(data)) {
                setHotels(data.map(h => ({ ...h, id: h._id })));
            }
        } catch (err) {
            console.error('Failed to fetch hotels:', err);
        }
    };

    const fetchUsers = async () => {
        setUserLoading(true);
        try {
            const data = await api.getAllUsers(token);
            if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setUserLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2 style={{ color: 'var(--danger)' }}>🔒 Access Denied</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Admin privileges required.</p>
                <button className="btn btn-primary" onClick={() => navigate('/search')} style={{ marginTop: '1rem' }}>← Go to Search</button>
            </div>
        );
    }

    const maxBooking = stats?.monthlyBookings ? Math.max(...stats.monthlyBookings.map(b => b.count), 1) : 10;

    const TABS = [
        { id: 'dashboard', label: '📊 Dashboard' },
        { id: 'flights', label: '✈️ Flights' },
        { id: 'hotels', label: '🏨 Hotels' },
        { id: 'users', label: '👥 Users' },
        { id: 'offers', label: '🎁 Offers' },
        { id: 'reports', label: '📈 Reports' },
        { id: 'settings', label: '⚙ Settings' },
        { id: 'help', label: '🗨 Support' },
    ];

    const addFlight = () => {
        if (!newFlight.id || !newFlight.from || !newFlight.to || !newFlight.price) return;
        if (editFlightId) {
            setFlights(prev => prev.map(f => f.id === editFlightId ? { ...newFlight, price: Number(newFlight.price) } : f));
            setEditFlightId(null);
        } else {
            setFlights(prev => [...prev, { ...newFlight, price: Number(newFlight.price) }]);
        }
        setNewFlight({ id: '', from: '', to: '', dep: '', arr: '', price: '', status: 'Active' });
    };

    const editFlight = (f) => { setNewFlight({ ...f }); setEditFlightId(f.id); };
    const deleteFlight = (id) => setFlights(prev => prev.filter(f => f.id !== id));
    const toggleHotelStatus = (id) => setHotels(prev => prev.map(h => h.id === id ? { ...h, status: h.status === 'Active' ? 'Inactive' : 'Active' } : h));
    const toggleOffer = (id) => setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
    const addOffer = () => {
        if (!newOffer.code || !newOffer.discount || !newOffer.validTill) return;
        setOffers(prev => [...prev, { ...newOffer, id: Date.now(), active: true }]);
        setNewOffer({ code: '', type: 'Flight', discount: '', validTill: '' });
    };
    const deleteOffer = (id) => setOffers(prev => prev.filter(o => o.id !== id));

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await api.deleteUser(id, token);
            if (res.message) {
                setUsers(prev => prev.filter(u => u._id !== id));
            }
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleUpdateUser = async () => {
        try {
            if (userModal.type === 'add') {
                const res = await api.createUser(userModal.data, token);
                if (res._id) {
                    setUsers(prev => [res, ...prev]);
                    setUserModal({ open: false, type: 'add', data: { name: '', email: '', password: '', role: 'user' } });
                } else {
                    alert(res.message || 'Failed to create user');
                }
            } else {
                const res = await api.updateUser(userModal.data._id, userModal.data, token);
                if (res._id) {
                    setUsers(prev => prev.map(u => u._id === res._id ? res : u));
                    setUserModal({ open: false, type: 'add', data: { name: '', email: '', password: '', role: 'user' } });
                } else {
                    alert(res.message || 'Failed to update user');
                }
            }
        } catch (err) {
            alert('An error occurred');
        }
    };

    const statusColor = { Active: '#10b981', Delayed: '#f59e0b', Inactive: '#ef4444', Seasonal: '#6366f1' };

    return (
        <div className="page admin-page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>📊 Admin Dashboard</h1>
                    <p>Full control over flights, hotels, offers & analytics</p>
                </div>
                <button className="btn btn-secondary" onClick={() => { fetchStats(); fetchUsers(); }} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔄 Refresh Data
                </button>
            </div>

            {/* Tab Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--bg-glass)', padding: '0.4rem', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); window.location.hash = tab.id === 'dashboard' ? '' : tab.id; }}
                        style={{
                            flex: 1, padding: '0.65rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem',
                            cursor: 'pointer', border: 'none', transition: 'all 0.25s',
                            background: activeTab === tab.id ? 'var(--accent-gradient)' : 'transparent',
                            color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                        }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && stats && (
                <>
                    <div className="admin-stats">
                        {[
                            { icon: '📋', val: stats.totalBookings.toLocaleString(), label: 'Total Bookings', color: '#6366f1' },
                            { icon: '✈️', val: stats.flightBookingsCount || 0, label: 'Flight Bookings', color: '#3b82f6' },
                            { icon: '🏨', val: stats.hotelBookingsCount || 0, label: 'Hotel Bookings', color: '#10b981' },
                            { icon: '💰', val: `₹${(stats.revenue / 100000).toFixed(2)}L`, label: 'Total Revenue', color: '#f59e0b' },
                            { icon: '👥', val: stats.passengers.toLocaleString(), label: 'Total Members', color: '#ec4899' },
                            { icon: '⚡', val: stats.activeToday || 0, label: 'Active Today', color: '#ef4444' },
                        ].map(s => (
                            <div key={s.label} className="stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
                                <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="stat-value">{s.val}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>📈 Monthly Bookings</h3>
                            <div className="admin-chart">
                                {stats.monthlyBookings.map(item => (
                                    <div key={item.month} className="chart-bar-wrapper">
                                        <div className="chart-value">{item.count}</div>
                                        <div className="chart-bar" style={{ height: `${(item.count / maxBooking) * 100}%` }} />
                                        <div className="chart-label">{item.month}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card">
                            <h3 style={{ marginBottom: '1rem' }}>🎯 Quick Stats</h3>
                            {[
                                { label: 'Avg Booking Value', value: stats.totalBookings > 0 ? `₹${Math.round(stats.revenue / stats.totalBookings).toLocaleString()}` : '₹0', icon: '💵' },
                                { label: 'UPI Payments', value: stats.paymentCounts?.upi || 0, icon: '📱' },
                                { label: 'Card Payments', value: stats.paymentCounts?.card || 0, icon: '💳' },
                                { label: 'Bank Transfers', value: stats.paymentCounts?.bank || 0, icon: '🏦' },
                                { label: 'Active Flights', value: stats.activeFlights, icon: '✈️' },
                                { label: 'On-Time Performance', value: '94.2%', icon: '⏰' },
                            ].map(s => (
                                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{s.icon} {s.label}</span>
                                    <span style={{ fontWeight: 700 }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>📝 Recent Bookings</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead><tr><th>Booking ID</th><th>Passenger</th><th>Flight</th><th>Route</th><th>Amount</th><th>Status</th></tr></thead>
                                <tbody>
                                    {stats.recentBookings.map(b => (
                                        <tr key={b.id}>
                                            <td style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>{b.id}</td>
                                            <td>{b.passenger}</td><td>{b.flight}</td><td>{b.route}</td>
                                            <td style={{ fontWeight: 600 }}>₹{b.amount?.toLocaleString()}</td>
                                            <td><span className={`status-badge ${b.status?.toLowerCase()}`}>{b.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {!stats && activeTab === 'dashboard' && (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="processing-spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '1rem' }}>Fetching live dashboard data...</p>
                </div>
            )}

            {/* FLIGHTS TAB */}
            {activeTab === 'flights' && (
                <>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1.25rem' }}>{editFlightId ? '✏️ Edit Flight' : '➕ Add New Flight'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                            {[['id', 'Flight ID (e.g. SK505)'], ['from', 'From (City + Code)'], ['to', 'To (City + Code)']].map(([k, ph]) => (
                                <div key={k} className="form-group" style={{ margin: 0 }}>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{ph}</label>
                                    <input className="form-input" placeholder={ph} value={newFlight[k]} onChange={e => setNewFlight(p => ({ ...p, [k]: e.target.value }))} />
                                </div>
                            ))}
                            {[['dep', 'Departure Time'], ['arr', 'Arrival Time'], ['price', 'Price (₹)']].map(([k, ph]) => (
                                <div key={k} className="form-group" style={{ margin: 0 }}>
                                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{ph}</label>
                                    <input className="form-input" placeholder={ph} value={newFlight[k]} onChange={e => setNewFlight(p => ({ ...p, [k]: e.target.value }))} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-primary" onClick={addFlight}>{editFlightId ? 'Update Flight' : 'Add Flight'}</button>
                            {editFlightId && <button className="btn" onClick={() => { setEditFlightId(null); setNewFlight({ id: '', from: '', to: '', dep: '', arr: '', price: '', status: 'Active' }); }} style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}>Cancel</button>}
                        </div>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>✈️ All Flights ({flights.length})</h3>
                        <table className="admin-table">
                            <thead><tr><th>ID</th><th>From</th><th>To</th><th>Dep</th><th>Arr</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {flights.map(f => (
                                    <tr key={f.id}>
                                        <td style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{f.id}</td>
                                        <td>{f.from}</td><td>{f.to}</td><td>{f.dep}</td><td>{f.arr}</td>
                                        <td style={{ fontWeight: 600 }}>₹{Number(f.price).toLocaleString()}</td>
                                        <td><span style={{ background: `${statusColor[f.status]}20`, color: statusColor[f.status], borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>{f.status}</span></td>
                                        <td style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button onClick={() => editFlight(f)} style={{ background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Edit</button>
                                            <button onClick={() => deleteFlight(f.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* HOTELS TAB */}
            {activeTab === 'hotels' && (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>🏨 Hotel Management ({hotels.length})</h3>
                    <table className="admin-table">
                        <thead><tr><th>ID</th><th>Hotel Name</th><th>City</th><th>Price/Night</th><th>Rating</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {hotels.map(h => (
                                <tr key={h.id}>
                                    <td style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>#{h.id}</td>
                                    <td style={{ fontWeight: 600 }}>{h.name}</td>
                                    <td>📍 {h.city}</td>
                                    <td style={{ fontWeight: 600 }}>₹{h.price.toLocaleString()}</td>
                                    <td>⭐ {h.rating}</td>
                                    <td><span style={{ background: h.status === 'Active' ? '#d1fae5' : '#fee2e2', color: h.status === 'Active' ? '#059669' : '#dc2626', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>{h.status}</span></td>
                                    <td>
                                        <button onClick={() => toggleHotelStatus(h.id)} style={{ background: h.status === 'Active' ? '#fee2e2' : '#d1fae5', color: h.status === 'Active' ? '#dc2626' : '#059669', border: 'none', borderRadius: '6px', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                                            {h.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>👥 User Management ({users.length})</h3>
                        <button className="btn btn-primary" onClick={() => setUserModal({ open: true, type: 'add', data: { name: '', email: '', password: '', role: 'user' } })}>
                            ➕ Add User
                        </button>
                    </div>
                    {userLoading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}><div className="processing-spinner"></div></div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Last Login</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{u.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {u._id.slice(-6)}</div>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`status-badge ${u.role}`} style={{ textTransform: 'capitalize' }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => setUserModal({ open: true, type: 'edit', data: u })} 
                                                        style={{ background: '#dbeafe', color: '#2563eb', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDeleteUser(u._id)} 
                                                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* OFFERS TAB */}
            {activeTab === 'offers' && (
                <>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1.25rem' }}>➕ Create New Offer</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Promo Code</label>
                                <input className="form-input" placeholder="e.g. SUMMER25" value={newOffer.code} onChange={e => setNewOffer(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Type</label>
                                <select className="form-select" value={newOffer.type} onChange={e => setNewOffer(p => ({ ...p, type: e.target.value }))}>
                                    <option>Flight</option><option>Hotel</option><option>Both</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Discount (% or ₹)</label>
                                <input className="form-input" placeholder="e.g. 25% or ₹500" value={newOffer.discount} onChange={e => setNewOffer(p => ({ ...p, discount: e.target.value }))} />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Valid Till</label>
                                <input className="form-input" type="date" value={newOffer.validTill} onChange={e => setNewOffer(p => ({ ...p, validTill: e.target.value }))} />
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={addOffer}>Create Offer 🎁</button>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>🎁 All Offers ({offers.length})</h3>
                        <table className="admin-table">
                            <thead><tr><th>Code</th><th>Type</th><th>Discount</th><th>Valid Till</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {offers.map(o => (
                                    <tr key={o.id}>
                                        <td style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '1px', color: 'var(--accent-secondary)' }}>{o.code}</td>
                                        <td><span style={{ fontSize: '0.78rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: 'var(--bg-glass)', fontWeight: 600 }}>{o.type}</span></td>
                                        <td style={{ fontWeight: 700, color: '#059669' }}>{o.discount}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{o.validTill}</td>
                                        <td><span style={{ background: o.active ? '#d1fae5' : '#fee2e2', color: o.active ? '#059669' : '#dc2626', borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>{o.active ? 'Active' : 'Paused'}</span></td>
                                        <td style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button onClick={() => toggleOffer(o.id)} style={{ background: o.active ? '#fef3c7' : '#d1fae5', color: o.active ? '#d97706' : '#059669', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>{o.active ? 'Pause' : 'Activate'}</button>
                                            <button onClick={() => deleteOffer(o.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            
            {/* REPORTS TAB */}
            {activeTab === 'reports' && (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>📈 Financial Reports</h3>
                    <div style={{ background: 'var(--bg-glass)', padding: '2rem', borderRadius: '12px', border: '1px dashed var(--border-glass)', textAlign: 'center' }}>
                        <span style={{ fontSize: '2.5rem' }}>📊</span>
                        <h4 style={{ marginTop: '1rem', fontSize: '1.25rem' }}>Advanced Analytics</h4>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 0', lineHeight: 1.6 }}>Detailed revenue splits, tax calculations, and dynamic payout reports are currently being developed.</p>
                        <button className="btn btn-secondary" style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', fontWeight: 600 }}>Download Latest Summary (PDF)</button>
                    </div>
                </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>⚙ System Settings</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                            <div>
                                <strong style={{ fontSize: '1rem' }}>Maintenance Mode</strong>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Temporarily disable customer bookings for system upgrades.</p>
                            </div>
                            <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem 1.5rem', fontWeight: 600 }}>Enable</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                            <div>
                                <strong style={{ fontSize: '1rem' }}>API Webhooks</strong>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Manage third-party API integrations (Payments, SMTP, SMS).</p>
                            </div>
                            <button className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem', fontWeight: 600 }}>Configure</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                            <div>
                                <strong style={{ fontSize: '1rem' }}>Dynamic Pricing</strong>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Toggle automated demand-based flight pricing algorithm.</p>
                            </div>
                            <button className="btn btn-primary" style={{ background: '#10b981', padding: '0.5rem 1.5rem', fontWeight: 600 }}>Active</button>
                        </div>
                    </div>
                </div>
            )}

            {/* STAFF SUPPORT TAB */}
            {activeTab === 'help' && (
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>🗨 Staff Support Directory</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🎫</div>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>IT Helpdesk</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>Open a ticket for technical issues or portal access requests.</p>
                            <div style={{ fontWeight: 700, color: '#3b82f6', fontSize: '0.9rem' }}>Ext. 4200</div>
                        </div>

                        <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📧</div>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Email Support</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>Direct email branch for non-urgent administrative queries.</p>
                            <a href="mailto:it-support@skyway.com" style={{ fontWeight: 700, color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>it-support@skyway.com</a>
                        </div>
                        
                        <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📚</div>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Documentation Wiki</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>Access internal guides, employee manuals, and API endpoints.</p>
                            <a href="#" style={{ fontWeight: 700, color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>wiki.skyway.internal</a>
                        </div>
                        
                        <div style={{ background: 'linear-gradient(145deg, rgba(239,68,68,0.08), rgba(0,0,0,0))', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🚨</div>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Emergency Escalation</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>For P0 server incidents causing complete checkout outage.</p>
                            <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.9rem' }}>+91 800-SKY-9999</div>
                        </div>
                    </div>
                </div>
            )}

            {/* USER MODAL */}
            {userModal.open && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '450px', position: 'relative', animation: 'scaleUp 0.3s ease-out' }}>
                        <button onClick={() => setUserModal({ ...userModal, open: false })} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
                        <h3 style={{ marginBottom: '1.5rem' }}>{userModal.type === 'add' ? '✨ Add New User' : '✏️ Edit User'}</h3>
                        
                        <div className="form-group">
                            <label>Full Name</label>
                            <input className="form-input" placeholder="e.g. John Doe" value={userModal.data.name} onChange={e => setUserModal({...userModal, data: {...userModal.data, name: e.target.value}})} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input className="form-input" type="email" placeholder="user@skyway.com" value={userModal.data.email} onChange={e => setUserModal({...userModal, data: {...userModal.data, email: e.target.value}})} />
                        </div>
                        {userModal.type === 'add' && (
                            <div className="form-group">
                                <label>Password</label>
                                <input className="form-input" type="password" placeholder="Minimum 6 characters" value={userModal.data.password} onChange={e => setUserModal({...userModal, data: {...userModal.data, password: e.target.value}})} />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Role</label>
                            <select className="form-select" value={userModal.data.role} onChange={e => setUserModal({...userModal, data: {...userModal.data, role: e.target.value}})}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdateUser}>
                                {userModal.type === 'add' ? 'Create User' : 'Save Changes'}
                            </button>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setUserModal({ ...userModal, open: false })}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
