import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import BookingDetailModal from '../components/BookingDetailModal';



export default function MyBookings() {
    const { bookings, loadingBookings } = useBooking();
    const [selectedBooking, setSelectedBooking] = useState(null);



    if (loadingBookings) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <div className="processing-spinner" style={{ margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading your bookings...</p>
            </div>
        );
    }

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1>📅 My Bookings</h1>
                <p>Track all your flight and hotel reservations in one place.</p>
            </div>

            <div className="bookings-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                {!bookings || bookings.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3 }}>✈️🏨</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>No Bookings Found</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1.1rem' }}>
                            You haven't made any bookings yet. Start exploring flights and hotels!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {bookings.map((booking) => {
                            if (!booking) return null;
                            const type = booking.bookingType || booking.type || (booking.flight ? 'flight' : 'hotel');

                            return (
                                <div key={booking._id || booking.id} className="card booking-card" style={{
                                    display: 'flex', padding: 0, overflow: 'hidden',
                                    borderLeft: `6px solid ${type === 'flight' ? '#2563eb' : '#059669'}`,
                                    transition: 'var(--transition)'
                                }}>
                                    {/* Type Icon / Image */}
                                    <div style={{
                                        width: '120px', background: type === 'flight' ? '#eff6ff' : '#ecfdf5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'
                                    }}>
                                        {type === 'flight' ? '✈️' : '🏨'}
                                    </div>

                                    <div style={{ flex: 1, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <span style={{
                                                    fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.5rem',
                                                    borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px',
                                                    background: type === 'flight' ? '#2563eb' : '#059669', color: '#fff'
                                                }}>
                                                    {type}
                                                </span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                    ID: {booking.bookingId || booking.id}
                                                </span>
                                            </div>

                                            {type === 'flight' && booking.flight ? (
                                                <>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                                                        {booking.flight.from} → {booking.flight.to}
                                                    </h3>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                        🗓️ {booking.flight.date} · 🕒 {booking.flight.departure}
                                                    </p>
                                                </>
                                            ) : booking.hotel ? (
                                                <>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                                                        {booking.hotel.name}
                                                    </h3>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                        📍 {booking.hotel.city} · 🌙 {booking.nights} night{booking.nights !== 1 ? 's' : ''}
                                                    </p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                                        Check-in: {booking.checkIn}
                                                    </p>
                                                </>
                                            ) : (
                                                <p>Booking details unavailable</p>
                                            )}
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                                                ₹{(booking.totalPrice || booking.price)?.toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                                                Confirmed via {booking.paymentMethod?.toUpperCase()}
                                            </div>
                                            {booking.passengers && booking.passengers.length > 0 && (
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                    👤 {booking.passengers[0].firstName} {booking.passengers[0].lastName}
                                                    {booking.passengers.length > 1 && ` + ${booking.passengers.length - 1} more`}
                                                </div>
                                            )}
                                            <button 
                                                className="btn" 
                                                onClick={() => setSelectedBooking(booking)}
                                                style={{
                                                    padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 700,
                                                    background: '#f1f5f9', color: 'var(--text-secondary)', border: 'none'
                                                }}
                                            >
                                                View Details
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedBooking && (
                <BookingDetailModal 
                    booking={selectedBooking} 
                    onClose={() => setSelectedBooking(null)} 
                />
            )}
        </div>

    );
}
