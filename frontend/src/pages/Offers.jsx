import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FLIGHT_OFFERS = [
    { id: 1, tag: 'LIMITED TIME', title: 'Early Bird Discount', description: 'Book your flight 30 days in advance and save up to 30% on all domestic routes.', discount: '30% OFF', code: 'EARLY30', validTill: '2026-04-30', color: '#2563eb', icon: '🐦' },
    { id: 2, tag: 'WEEKEND SPECIAL', title: 'Weekend Getaway Sale', description: 'Fly this weekend to Goa, Manali or Ooty at flat ₹999 off on round trips.', discount: '₹999 OFF', code: 'WKND999', validTill: '2026-03-31', color: '#7c3aed', icon: '🌴' },
    { id: 3, tag: 'FAMILY PACK', title: 'Family Travel Bundle', description: 'Book for 4 or more passengers and get one free seat. Perfect for family trips!', discount: '1 FREE SEAT', code: 'FAM4ONE', validTill: '2026-05-15', color: '#059669', icon: '👨‍👩‍👧‍👦' },
    { id: 4, tag: 'STUDENT OFFER', title: 'Student Discount', description: 'Valid student ID holders get flat 20% discount on all economy tickets.', discount: '20% OFF', code: 'STU20', validTill: '2026-12-31', color: '#d97706', icon: '🎓' },
    { id: 5, tag: 'MONSOON DEAL', title: 'Monsoon Magic', description: 'Travel during the monsoon season and enjoy exclusive discounts on select routes.', discount: '25% OFF', code: 'MOON25', validTill: '2026-09-30', color: '#0891b2', icon: '🌧️' },
    { id: 6, tag: 'FIRST BOOKING', title: 'First Booking Bonus', description: "New to SkyWay? Your first booking gets you 15% off plus priority boarding!", discount: '15% OFF', code: 'FIRST15', validTill: '2026-12-31', color: '#e11d48', icon: '🎉' },
];

const HOTEL_OFFERS = [
    { id: 7, tag: 'HOTEL DEAL', title: 'Hotel Early Offer', description: 'Book any hotel stay 7+ days in advance and enjoy 10% discount on room rates.', discount: '10% OFF', code: 'HOTEL10', validTill: '2026-06-30', color: '#0f766e', icon: '🏨', isHotel: true },
    { id: 8, tag: 'RESORT SPECIAL', title: 'Resort Luxury Deal', description: 'Stay at any beach or mountain resort and get flat 20% off. Includes Sea Breeze, Backwater!', discount: '20% OFF', code: 'RESORT20', validTill: '2026-05-31', color: '#b45309', icon: '🌊', isHotel: true },
    { id: 9, tag: 'SPA & WELLNESS', title: 'Spa Package Deal', description: 'Book hotels with spa facilities and save 15%. Perfect for a relaxation getaway.', discount: '15% OFF', code: 'SPA15', validTill: '2026-07-31', color: '#9333ea', icon: '💆', isHotel: true },
];

export default function Offers() {
    const navigate = useNavigate();
    const [copiedCode, setCopiedCode] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const copyCode = (code) => {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const allOffers = [...FLIGHT_OFFERS, ...HOTEL_OFFERS];
    const displayOffers = activeTab === 'flights' ? FLIGHT_OFFERS : activeTab === 'hotels' ? HOTEL_OFFERS : allOffers;

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1>🎁 Special Offers & Rewards</h1>
                <p>Exclusive deals for flights and hotels to make your travel more affordable.</p>
            </div>

            {/* Hero Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', borderRadius: '16px', padding: '2.5rem', marginBottom: '2rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', opacity: 0.8, marginBottom: '0.5rem' }}>MEGA SALE</div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Up to 40% OFF</h2>
                    <p style={{ opacity: 0.9, maxWidth: '400px' }}>On all flights & hotels this month. Don't miss this chance to explore!</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button className="btn" onClick={() => navigate('/search')} style={{ background: '#fff', color: '#2563eb', fontWeight: 700 }}>
                            Book Flight ✈️
                        </button>
                        <button className="btn" onClick={() => navigate('/hotels')} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, border: '2px solid rgba(255,255,255,0.4)' }}>
                            Book Hotel 🏨
                        </button>
                    </div>
                </div>
                <div style={{ fontSize: '8rem', opacity: 0.2 }}>🎁</div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {[['all', '🎁 All Offers'], ['flights', '✈️ Flight Deals'], ['hotels', '🏨 Hotel Deals']].map(([key, label]) => (
                    <button key={key} onClick={() => setActiveTab(key)}
                        style={{
                            padding: '0.6rem 1.25rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                            background: activeTab === key ? '#2563eb' : '#f1f5f9',
                            color: activeTab === key ? '#fff' : 'var(--text-secondary)',
                            border: 'none', transition: 'all 0.2s'
                        }}>{label}</button>
                ))}
            </div>

            {/* Offer Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {displayOffers.map(offer => (
                    <div key={offer.id} className="card" style={{ borderTop: `4px solid ${offer.color}`, position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <span style={{ background: `${offer.color}20`, color: offer.color, borderRadius: '50px', padding: '0.2rem 0.7rem', fontSize: '0.7rem', fontWeight: 700 }}>
                                    {offer.tag}
                                </span>
                            </div>
                            <span style={{ fontSize: '2rem' }}>{offer.icon}</span>
                        </div>
                        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{offer.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{offer.description}</p>

                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROMO CODE</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: offer.color, letterSpacing: '2px' }}>{offer.code}</div>
                                </div>
                                <button onClick={() => copyCode(offer.code)} style={{
                                    background: copiedCode === offer.code ? '#059669' : offer.color,
                                    color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                    {copiedCode === offer.code ? '✓ Copied!' : 'Copy Code'}
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: offer.isHotel ? '1rem' : 0 }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Valid till: {offer.validTill}</span>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: offer.color }}>{offer.discount}</span>
                        </div>

                        {/* Hotel offer CTA */}
                        {offer.isHotel && (
                            <button onClick={() => navigate('/hotels')}
                                style={{
                                    width: '100%', padding: '0.6rem', borderRadius: '10px', fontWeight: 700,
                                    background: `${offer.color}15`, color: offer.color,
                                    border: `2px solid ${offer.color}40`, cursor: 'pointer', fontSize: '0.85rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.target.style.background = offer.color; e.target.style.color = '#fff'; }}
                                onMouseLeave={e => { e.target.style.background = `${offer.color}15`; e.target.style.color = offer.color; }}>
                                🏨 Book a Hotel with this Offer
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
