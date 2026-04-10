import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

const TIER_CONFIG = [
    { name: 'Silver', min: 0, max: 999, color: '#94a3b8', icon: '🥈', perks: ['Priority check-in', 'Extra baggage 5kg', '10% lounge discount'] },
    { name: 'Gold', min: 1000, max: 4999, color: '#f59e0b', icon: '🥇', perks: ['Lounge access (2/year)', 'Extra baggage 10kg', '20% hotel discount', 'Free seat selection'] },
    { name: 'Platinum', min: 5000, max: Infinity, color: '#a78bfa', icon: '💎', perks: ['Unlimited lounge access', 'Extra baggage 20kg', '30% hotel discount', 'Free upgrades', 'Dedicated support'] },
];

const REDEEM_OPTIONS = [
    { id: 1, title: 'Flight Discount', subtitle: '₹500 off your next flight', points: 500, icon: '✈️', color: '#6366f1' },
    { id: 2, title: 'Hotel Discount', subtitle: '₹300 off hotel stay', points: 300, icon: '🏨', color: '#0891b2' },
    { id: 3, title: 'Extra Baggage', subtitle: '10kg extra on any flight', points: 200, icon: '🧳', color: '#059669' },
    { id: 4, title: 'Seat Upgrade', subtitle: 'Economy → Business class', points: 1000, icon: '💺', color: '#d97706' },
    { id: 5, title: 'Airport Lounge', subtitle: 'Single entry – any airport', points: 400, icon: '🛋️', color: '#7c3aed' },
    { id: 6, title: 'Travel Insurance', subtitle: 'Full trip coverage', points: 350, icon: '🛡️', color: '#e11d48' },
];

export default function Rewards() {
    const { user } = useAuth();
    const { bookings } = useBooking();
    const navigate = useNavigate();
    const [redeemedId, setRedeemedId] = useState(null);
    const [redeemMsg, setRedeemMsg] = useState('');

    // Calculate total points from bookings + welcome points
    const welcomePoints = 500;
    const bookingPoints = (bookings || []).reduce((sum, b) => sum + Math.floor((b.totalPrice || b.total || 0) / 10), 0);
    const totalPoints = welcomePoints + bookingPoints;

    const tier = TIER_CONFIG.find(t => totalPoints >= t.min && totalPoints <= t.max) || TIER_CONFIG[0];
    const nextTier = TIER_CONFIG.find(t => t.min > totalPoints);
    const progressToNext = nextTier ? Math.min(((totalPoints - tier.min) / (nextTier.min - tier.min)) * 100, 100) : 100;

    const handleRedeem = (option) => {
        if (totalPoints < option.points) {
            setRedeemMsg(`❌ Not enough points. You need ${option.points - totalPoints} more.`);
            setTimeout(() => setRedeemMsg(''), 3000);
            return;
        }
        setRedeemedId(option.id);
        setRedeemMsg(`🎉 "${option.title}" redeemed! Discount applied to your next booking.`);
        setTimeout(() => { setRedeemedId(null); setRedeemMsg(''); }, 4000);
    };

    const pointsHistory = [
        { label: 'Welcome Bonus 🎁', points: +500, date: user?.joinDate ? new Date(user.joinDate).toLocaleDateString('en-IN') : 'When joined', type: 'earned' },
        ...(bookings || []).slice(0, 6).map(b => ({
            label: b.type === 'hotel' ? `Hotel: ${b.hotel?.name || 'Booking'}` : `Flight: ${b.from || ''} → ${b.to || ''}`,
            points: +Math.floor((b.totalPrice || b.total || 0) / 10),
            date: b.date || b.checkIn || 'Recent',
            type: 'earned'
        })),
    ];

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1>🏆 Rewards & Loyalty</h1>
                <p>Earn points on every booking and unlock exclusive perks</p>
            </div>

            {/* Points Hero */}
            <div style={{ background: `linear-gradient(135deg, ${tier.color}22 0%, #1e1b4b 100%)`, border: `1px solid ${tier.color}40`, borderRadius: '20px', padding: '2.25rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', fontSize: '10rem', opacity: 0.07 }}>🏆</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '2px', marginBottom: '0.5rem' }}>TOTAL POINTS</div>
                        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{totalPoints.toLocaleString()}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: '0.3rem' }}>SkyWay Miles</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem' }}>{tier.icon}</div>
                        <div style={{ color: tier.color, fontWeight: 800, fontSize: '1.1rem' }}>{tier.name} Member</div>
                        {nextTier && (
                            <>
                                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                                    {nextTier.min - totalPoints} pts to {nextTier.name}
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '999px', height: '6px', marginTop: '0.5rem', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${progressToNext}%`, background: `linear-gradient(90deg, ${tier.color}, ${nextTier ? TIER_CONFIG[TIER_CONFIG.indexOf(tier) + 1]?.color : tier.color})`, borderRadius: '999px', transition: 'width 1s ease' }} />
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '2px', marginBottom: '0.75rem' }}>YOUR PERKS</div>
                        {tier.perks.map(perk => (
                            <div key={perk} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ color: tier.color, fontSize: '0.8rem' }}>✓</span>
                                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>{perk}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tier Levels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                {TIER_CONFIG.map(t => (
                    <div key={t.name} className="card" style={{ border: `2px solid ${tier.name === t.name ? t.color : 'transparent'}`, background: tier.name === t.name ? `${t.color}15` : 'var(--bg-glass)', position: 'relative' }}>
                        {tier.name === t.name && (
                            <div style={{ position: 'absolute', top: '-10px', right: '1rem', background: t.color, color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>YOUR TIER</div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>{t.icon}</span>
                            <div>
                                <div style={{ fontWeight: 800, color: t.color }}>{t.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.max === Infinity ? `${t.min.toLocaleString()}+ pts` : `${t.min.toLocaleString()} – ${t.max.toLocaleString()} pts`}</div>
                            </div>
                        </div>
                        {t.perks.slice(0, 3).map(p => (
                            <div key={p} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                <span style={{ color: t.color }}>✓</span> {p}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Redeem Options */}
                <div>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🎁 Redeem Points</h3>
                    {redeemMsg && (
                        <div style={{ background: redeemMsg.startsWith('❌') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${redeemMsg.startsWith('❌') ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, color: redeemMsg.startsWith('❌') ? '#ef4444' : '#10b981', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.88rem' }}>
                            {redeemMsg}
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {REDEEM_OPTIONS.map(opt => (
                            <div key={opt.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: redeemedId === opt.id ? `2px solid ${opt.color}` : '1px solid var(--border-glass)' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${opt.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{opt.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{opt.title}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{opt.subtitle}</div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ color: opt.color, fontWeight: 800, fontSize: '0.9rem' }}>{opt.points} pts</div>
                                    <button onClick={() => handleRedeem(opt)}
                                        style={{ marginTop: '0.3rem', padding: '0.35rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, border: 'none', background: totalPoints >= opt.points ? opt.color : 'rgba(255,255,255,0.1)', color: totalPoints >= opt.points ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                                        {redeemedId === opt.id ? '✓ Done!' : 'Redeem'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Points History */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>📊 Points History</h3>
                    <div className="card" style={{ padding: '1.25rem' }}>
                        {pointsHistory.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                                <p>No bookings yet. Start booking to earn points!</p>
                                <button className="btn btn-primary" onClick={() => navigate('/search')} style={{ marginTop: '1rem' }}>Search Flights ✈️</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {pointsHistory.map((h, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.75rem', background: 'var(--bg-glass)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{h.label}</div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{h.date}</div>
                                        </div>
                                        <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>+{h.points} pts</div>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.75rem', borderTop: '1px solid var(--border-glass)', marginTop: '0.25rem', fontWeight: 800, fontSize: '0.95rem' }}>
                                    <span>Total Balance</span>
                                    <span style={{ color: '#a78bfa' }}>{totalPoints} pts</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* How to earn */}
                    <div className="card" style={{ marginTop: '1.25rem', padding: '1.25rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>⚡ How to Earn More</h4>
                        {[
                            { action: 'Book a flight', points: '÷10 of fare', icon: '✈️' },
                            { action: 'Book a hotel', points: '÷10 of fare', icon: '🏨' },
                            { action: 'Write a review', points: '+50 pts', icon: '⭐' },
                            { action: 'Refer a friend', points: '+200 pts', icon: '👥' },
                            { action: 'Birthday bonus', points: '+100 pts', icon: '🎂' },
                        ].map(item => (
                            <div key={item.action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                                <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{item.icon} {item.action}</span>
                                <span style={{ fontWeight: 700, color: '#a78bfa', fontSize: '0.83rem' }}>{item.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
