import React from 'react';

export default function BookingDetailModal({ booking, onClose }) {
    if (!booking) return null;

    const type = booking.bookingType || (booking.flight ? 'flight' : 'hotel');
    
    const downloadReceipt = () => {
        // Create a simple text-based receipt or trigger print
        window.print();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content booking-detail-modal no-print" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                
                <div className="modal-header">
                    <div className="airline-badge">
                        {type === 'flight' ? '✈️ Flight Ticket' : '🏨 Hotel Voucher'}
                    </div>
                    <h2>Booking Confirmation</h2>
                    <p className="booking-id">ID: {booking.bookingId}</p>
                </div>

                <div className="modal-body">
                    {type === 'flight' ? (
                        <div className="flight-details">
                            <div className="detail-row main-route">
                                <div className="detail-item">
                                    <label>From</label>
                                    <div className="value">{booking.flight?.from}</div>
                                </div>
                                <div className="route-arrow">→</div>
                                <div className="detail-item">
                                    <label>Destination</label>
                                    <div className="value">{booking.flight?.to}</div>
                                </div>
                            </div>

                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Flight</label>
                                    <div className="value">{booking.flight?.airline?.name} ({booking.flight?.flightNumber})</div>
                                </div>
                                <div className="detail-item">
                                    <label>Date</label>
                                    <div className="value">{booking.flight?.date}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Departure</label>
                                    <div className="value">{booking.flight?.departure}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Arrival</label>
                                    <div className="value">{booking.flight?.arrival}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Gate</label>
                                    <div className="value" style={{ color: '#2563eb', fontWeight: 800 }}>{booking.flight?.gateNo || 'A1'}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Seats</label>
                                    <div className="value">{booking.seats?.map(s => s.id).join(', ')}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hotel-details">
                            <div className="detail-row">
                                <div className="detail-item">
                                    <label>Hotel Name</label>
                                    <div className="value">{booking.hotel?.name}</div>
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-item">
                                    <label>Address</label>
                                    <div className="value" style={{ fontSize: '0.9rem' }}>{booking.hotel?.address || `${booking.hotel?.city}, India`}</div>
                                </div>
                            </div>

                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Check-in</label>
                                    <div className="value">{booking.checkIn}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Check-out</label>
                                    <div className="value">{booking.checkOut}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Nights</label>
                                    <div className="value">{booking.nights}</div>
                                </div>
                                <div className="detail-item">
                                    <label>Room No</label>
                                    <div className="value" style={{ color: '#059669', fontWeight: 800 }}>{booking.roomNo || '302'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="passenger-section">
                        <h4>Passengers / Guests</h4>
                        <div className="passenger-list">
                            {booking.passengers?.map((p, i) => (
                                <div key={i} className="passenger-item">
                                    👤 {p.firstName} {p.lastName} <span className="p-email">({p.email})</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="payment-summary">
                        <div className="payment-row">
                            <span>Status</span>
                            <span className="status-confirmed">Confirmed</span>
                        </div>
                        <div className="payment-row">
                            <span>Method</span>
                            <span>{booking.paymentMethod?.toUpperCase()}</span>
                        </div>
                        <div className="payment-row total">
                            <span>Total Price</span>
                            <span>₹{booking.totalPrice?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    {type === 'flight' ? (
                        <a 
                            href={`/ticket/${booking.bookingId}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ textDecoration: 'none', textAlign: 'center' }}
                        >
                            ✈️ Download Ticket
                        </a>
                    ) : (
                        <button className="btn btn-primary" onClick={downloadReceipt}>
                            📥 Download Receipt
                        </button>
                    )}
                </div>

            </div>

            {/* PRINT ONLY SECTION */}
            <div className="print-receipt">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1>SkyWay Airlines</h1>
                    <p>Booking Receipt & Confirmation</p>
                </div>
                <hr />
                <div style={{ margin: '2rem 0' }}>
                    <p><strong>Booking ID:</strong> {booking.bookingId}</p>
                    <p><strong>Type:</strong> {type.toUpperCase()}</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
                <h3>Details</h3>
                {type === 'flight' ? (
                    <div>
                        <p><strong>Route:</strong> {booking.flight?.from} to {booking.flight?.to}</p>
                        <p><strong>Flight:</strong> {booking.flight?.flightNumber}</p>
                        <p><strong>Departure:</strong> {booking.flight?.departure}</p>
                        <p><strong>Gate:</strong> {booking.flight?.gateNo || 'A1'}</p>
                        <p><strong>Seats:</strong> {booking.seats?.map(s => s.id).join(', ')}</p>
                    </div>
                ) : (
                    <div>
                        <p><strong>Hotel:</strong> {booking.hotel?.name}</p>
                        <p><strong>Address:</strong> {booking.hotel?.address}</p>
                        <p><strong>Check-in:</strong> {booking.checkIn}</p>
                        <p><strong>Room No:</strong> {booking.roomNo}</p>
                    </div>
                )}
                <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <p><strong>Total Amount Paid:</strong> ₹{booking.totalPrice?.toLocaleString()}</p>
                </div>
                <div style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                    Thank you for choosing SkyWay Airlines! This is a computer-generated receipt.
                </div>
            </div>
        </div>
    );
}
