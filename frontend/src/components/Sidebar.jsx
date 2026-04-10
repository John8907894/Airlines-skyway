import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const link = (to, icon, label, onClick = null) => {
        const currentPath = location.pathname + location.hash;
        const isActive = currentPath === to;
        
        if (onClick) {
            return (
                <button onClick={onClick} className="sidebar-link log-out">
                    <span className="link-icon">{icon}</span> {label}
                </button>
            );
        }

        return (
            <Link to={to} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                <span className="link-icon">{icon}</span> {label}
            </Link>
        );
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span className="logo-icon">✈️</span>
                <span className="logo-text">SkyWay</span>
            </div>

            <div className="sidebar-scroll-area" style={{ flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
                {user.role === 'admin' ? (
                    <>
                        <div className="sidebar-group">
                            <h5 className="sidebar-heading">ADMIN DASHBOARD</h5>
                            {link('/admin', '📊', 'Overview')}
                            {link('/admin#flights', '✈️', 'Manage Flights')}
                            {link('/admin#hotels', '🏨', 'Manage Hotels')}
                            {link('/admin#users', '👥', 'Manage Users')}
                            {link('/admin#offers', '🎁', 'Offers & Deals')}
                        </div>
                        <div className="sidebar-group">
                            <h5 className="sidebar-heading">SYSTEM</h5>
                            {link('/admin#reports', '📈', 'Financial Reports')}
                            {link('/admin#settings', '⚙', 'System Settings')}
                            {link('/admin#help', '🗨', 'Staff Support')}
                            {/* Admin backup logout */}
                            {link('', '🚪', 'Log Out', logout)}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="sidebar-group">
                            <h5 className="sidebar-heading">MAIN</h5>
                            {link('/search', '⊞', 'Search Flights')}
                            {link('/hotels', '🏨', 'Hotels & Resorts')}
                            {link('/tracking', '✈️', 'Flight Tracking')}
                            {link('/bookings', '📅', 'My Bookings')}
                            {link('/favorites', '♡', 'Favorites')}
                        </div>
                        <div className="sidebar-group">
                            <h5 className="sidebar-heading">REWARDS</h5>
                            {link('/rewards', '🏆', 'Rewards')}
                            {link('/offers', '🎁', 'Offers & Deals')}
                        </div>
                        <div className="sidebar-group">
                            <h5 className="sidebar-heading">ACCOUNT</h5>
                            {link('/settings', '⚙', 'Settings')}
                            {link('/help', '🗨', 'Help & Support')}
                            {/* Backup logout button in the menu list */}
                            {link('', '🚪', 'Log Out', logout)}
                        </div>
                    </>
                )}
            </div>

            {/* Sticky footer with user info and primary logout button */}
            <div className="sidebar-footer" style={{ padding: '1rem' }}>
                <div className="sidebar-user" style={{ marginBottom: '0.75rem' }}>
                    <div className="sidebar-avatar" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>{user.name.charAt(0)}</div>
                    <div className="user-info">
                        <span className="user-name" style={{ fontSize: '0.85rem' }}>{user.name}</span>
                        <span className="user-email" style={{ fontSize: '0.7rem' }}>{user.email}</span>
                    </div>
                </div>
                
                <button 
                    onClick={logout}
                    className="btn btn-danger" 
                    style={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8rem',
                        padding: '0.4rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
                    }}
                >
                    🚪 Log Out
                </button>
            </div>
        </aside>
    );
}
