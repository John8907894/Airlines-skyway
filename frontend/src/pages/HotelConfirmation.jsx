import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function HotelConfirmation() {
    const navigate = useNavigate();
    const { hotelBooking, hotelBookingId } = useBooking();

    useEffect(() => {
        if (!hotelBooking || !hotelBookingId) {
            navigate('/hotels');
        }
    }, [hotelBooking, hotelBookingId, navigate]);

    if (!hotelBooking || !hotelBookingId) return null;

    const { hotel, checkIn, checkOut, nights, guests, total, paymentMethod, appliedCoupon, discount } = hotelBooking;

    const paymentLabels = {
        card: '💳 Credit / Debit Card',
        upi: '📱 UPI / Digital Wallet',
        netbanking: '🏦 Net Banking',
    };

    return (
        <div className="page fade-in" style={{ maxWidth: '680px', margin: '0 auto' }}>
            {/* Success Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                borderRadius: '20px', padding: '2.5rem', textAlign: 'center',
                color: '#fff', marginBottom: '2rem', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, fontSize: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏨</div>
                <div style={{ fontSize: '4rem', marginBottom: '0.75rem', animation: 'pulse 2s infinite' }}>✅</div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Booking Confirmed!</h1>
                <p style={{ opacity: 0.9, marginBottom: '1.25rem' }}>Your hotel stay has been successfully booked.</p>
                <div style={{
                    background: 'rgba(255,255,255,0.2)', borderRadius: '12px',
                    padding: '0.75rem 1.5rem', display: 'inline-block',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 700, letterSpacing: '2px' }}>BOOKING ID</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '1px', fontFamily: 'monospace' }}>{hotelBookingId}</div>
                </div>
            </div>

            {/* Hotel Details Card */}
            <div className="card" style={{ marginBottom: '1.5rem', overflow: 'hidden', padding: 0 }}>
                <div style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', padding: '1rem 1.5rem', color: '#fff' }}>
                    <h3 style={{ fontWeight: 700 }}>🏨 Hotel Details</h3>
                </div>
                <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem' }}>
                    <img src={hotel.image} alt={hotel.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{hotel.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>📍 {hotel.city} · ⭐ {hotel.rating} · {hotel.type}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                            {hotel.amenities.map(a => (
                                <span key={a} style={{ background: '#f1f5f9', color: '#64748b', borderRadius: '50px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 600 }}>
                                    ✓ {a}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stay Info */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📅 Stay Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                        { label: 'Check-In', value: checkIn, icon: '📅' },
                        { label: 'Check-Out', value: checkOut, icon: '📅' },
                        { label: 'Duration', value: `${nights} Night${nights !== 1 ? 's' : ''}`, icon: '🌙' },
                        { label: 'Guests', value: `${guests} Guest${guests !== 1 ? 's' : ''}`, icon: '👥' },
                    ].map(({ label, value, icon }) => (
                        <div key={label} style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.3rem' }}>{icon} {label.toUpperCase()}</div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Summary */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>💳 Payment Summary</h3>
                <div className="order-row">
                    <span>Payment Method</span>
                    <span style={{ fontWeight: 600 }}>{paymentLabels[paymentMethod] || paymentMethod}</span>
                </div>
                {hotelBooking.paymentDetails && (
                    <div className="order-row">
                        <span>Payment Details</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{hotelBooking.paymentDetails}</span>
                    </div>
                )}
                {appliedCoupon && (
                    <div className="order-row" style={{ color: '#059669' }}>
                        <span>Coupon Applied</span>
                        <span style={{ fontWeight: 700 }}>{appliedCoupon.code} (-₹{discount?.toLocaleString()})</span>
                    </div>
                )}
                <hr className="section-divider" />
                <div className="order-row total">
                    <span>Amount Paid</span>
                    <span>₹{(total || hotelBooking.total)?.toLocaleString()}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/bookings')}>
                    📋 View My Bookings
                </button>
                <button className="btn" style={{ flex: 1, background: 'var(--bg-glass)', color: 'var(--text-primary)', border: '2px solid var(--text-muted)' }}
                    onClick={() => navigate('/hotels')}>
                    🏨 Book Another Hotel
                </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                A confirmation has been saved to your bookings. 🎉 Enjoy your stay!
            </p>
        </div>
    );
}
