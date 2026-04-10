import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const formatTimeAMPM = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
};

function generateQRPattern() {
    const size = 11;
    const cells = [];
    for (let i = 0; i < size * size; i++) {
        cells.push(Math.random() > 0.5 ? 'dark' : 'light');
    }
    // Corner patterns
    [0, 1, 2, size, size * 2, size + 2, size * 2 + 2].forEach(i => cells[i] = 'dark');
    return cells;
}

export default function Ticket() {
    const { selectedFlight, selectedSeats, passengers, bookingId, bookings, loadingBookings, fetchBookings, resetBooking } = useBooking();
    const { id } = useParams();
    const navigate = useNavigate();
    const qrCells = useMemo(() => generateQRPattern(), []);
    
    // For historical bookings
    const [historicalBooking, setHistoricalBooking] = useState(null);

    useEffect(() => {
        // If an ID is provided but bookings haven't loaded, trigger a fetch
        if (id) {
            if (bookings && bookings.length > 0) {
                const found = bookings.find(b => b.bookingId === id || b._id === id);
                if (found) setHistoricalBooking(found);
            } else if (!loadingBookings && bookings.length === 0) {
                // bookings not yet fetched, fetch them
                if (typeof fetchBookings === 'function') fetchBookings();
            }
        }
    }, [id, bookings, loadingBookings]);

    // Determine which data to use
    const activeBooking = id ? historicalBooking : {
        bookingId,
        flight: selectedFlight,
        seats: selectedSeats,
        passengers,
        bookingType: 'flight'
    };

    const displayFlight = activeBooking?.flight;
    const displaySeats = activeBooking?.seats || [];
    const displayPassengers = activeBooking?.passengers || [];
    const displayId = activeBooking?.bookingId;

    // Show a loading state while bookings are being fetched for an ID-based view
    if (id && (loadingBookings || (!historicalBooking && bookings.length === 0))) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
                <h2>Loading your ticket...</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Please wait a moment.</p>
            </div>
        );
    }

    if (!displayFlight || !displayPassengers || displayPassengers.length === 0 || !displayId) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2>No booking found</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Please complete the booking process first.</p>
                <button className="btn btn-primary" onClick={() => navigate('/search')} style={{ marginTop: '1rem' }}>← Book a Flight</button>
            </div>
        );
    }


    const totalExtra = displaySeats.reduce((sum, s) => sum + s.extraPrice, 0);
    const baseFare = (displayFlight.price || 0) * displayPassengers.length;
    const taxes = Math.round(baseFare * 0.12);
    const calculatedTotal = baseFare + totalExtra + taxes + 199;
    const total = activeBooking?.totalPrice || calculatedTotal;

    const passengerNames = displayPassengers.map(p => `${p.firstName} ${p.lastName}`).join(', ');


    const shareWhatsApp = () => {
        const msg = encodeURIComponent(
            `✈️ My SkyWay Airlines Booking!\n\n` +
            `Booking ID: ${displayId}\n` +
            `Flight: ${displayFlight.id}\n` +
            `Route: ${displayFlight.from} → ${displayFlight.to}\n` +
            `Date: ${displayFlight.date}\n` +
            `Time: ${displayFlight.departure} - ${displayFlight.arrival}\n` +
            `Passengers: ${passengerNames}\n` +
            `Seat(s): ${displaySeats.map(s => s.id).join(', ')}\n` +
            `Amount: ₹${total.toLocaleString()}\n\n` +

            `Booked on SkyWay Airlines ✈️`
        );
        window.open(`https://wa.me/?text=${msg}`, '_blank');
    };

    const shareEmail = () => {
        const subject = encodeURIComponent(`SkyWay Airlines - Booking Confirmation ${displayId}`);
        const body = encodeURIComponent(
            `Dear ${displayPassengers[0].firstName},\n\n` +
            `Your flight has been successfully booked!\n\n` +
            `Booking ID: ${displayId}\n` +
            `Flight: ${displayFlight.airline.name} (${displayFlight.id})\n` +
            `Route: ${displayFlight.from} → ${displayFlight.to}\n` +
            `Date: ${displayFlight.date}\n` +
            `Departure: ${displayFlight.departure}\n` +
            `Arrival: ${displayFlight.arrival}\n` +
            `Passengers: ${passengerNames}\n` +
            `Seat(s): ${displaySeats.map(s => s.id).join(', ')}\n` +
            `Total Paid: ₹${total.toLocaleString()}\n\n` +
            `Have a pleasant journey!\n` +
            `SkyWay Airlines ✈️`
        );

        window.open(`mailto:${displayPassengers[0].email}?subject=${subject}&body=${body}`);
    };

    const downloadTicket = () => {
        // Use the browser's print dialog so user can save as PDF
        window.print();
    };


    const handleNewBooking = () => {
        resetBooking();
        navigate('/search');
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>🎉 Booking Confirmed!</h1>
                <p>Your ticket has been issued successfully.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 600 }}>
                    ✓ Confirmation message and receipt sent to {displayPassengers[0].email}
                </p>

            </div>

            <div className="ticket-container" style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>
                <div className="boarding-pass" id="boarding-pass">
                    <div className="boarding-pass-header">
                        <h3>✈️ SkyWay Airlines</h3>
                        <span className="booking-id">{displayId}</span>
                    </div>

                    <div className="boarding-pass-body">
                        <div className="boarding-route">
                            <div className="boarding-city">
                                <div className="code">{displayFlight.from.slice(0, 3).toUpperCase()}</div>
                                <div className="name">{displayFlight.from}</div>
                            </div>
                            <div className="boarding-plane">✈️</div>
                            <div className="boarding-city">
                                <div className="code">{displayFlight.to.slice(0, 3).toUpperCase()}</div>
                                <div className="name">{displayFlight.to}</div>
                            </div>
                        </div>


                        <div className="boarding-details">
                            <div className="boarding-detail" style={{ gridColumn: 'span 2' }}>
                                <label>Passengers</label>
                                <span style={{ display: 'block' }}>
                                    {displayPassengers.map((p, i) => (
                                        <div key={i} style={{ marginBottom: '0.2rem' }}>
                                            {p.firstName} {p.lastName} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({displaySeats[i]?.id || 'Checkin Req.'})</span>
                                        </div>
                                    ))}
                                </span>
                            </div>
                            <div className="boarding-detail">
                                <label>Flight</label>
                                <span>{displayFlight.id || displayFlight.flightNumber}</span>
                            </div>
                            <div className="boarding-detail">
                                <label>Date</label>
                                <span>{displayFlight.date}</span>
                            </div>
                            <div className="boarding-detail">
                                <label>Departure</label>
                                <span>{formatTimeAMPM(displayFlight.departure)}</span>
                            </div>
                            <div className="boarding-detail">
                                <label>Arrival</label>
                                <span>{formatTimeAMPM(displayFlight.arrival)}</span>
                            </div>
                            <div className="boarding-detail">
                                <label>Seat(s)</label>
                                <span>{displaySeats.length > 0 ? displaySeats.map(s => s.id).join(', ') : 'Assigning...'}</span>
                            </div>
                            <div className="boarding-detail">
                                <label>Class</label>
                                <span style={{ textTransform: 'capitalize' }}>{displaySeats[0]?.seatClass || 'Economy'}</span>
                            </div>

                            <div className="boarding-detail">
                                <label>Payment</label>
                                <span style={{ fontSize: '0.8rem' }}>Confirmed</span>
                            </div>
                            <div className="boarding-detail">
                                <label>Amount Paid</label>
                                <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="boarding-pass-footer">
                        <div className="boarding-qr">
                            <div className="qr-grid">
                                {qrCells.map((cell, i) => (
                                    <div key={i} className={`qr-cell ${cell}`}></div>
                                ))}
                            </div>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Scan QR code at the airport gate</p>
                    </div>
                </div>

                <div className="ticket-actions">
                    <button className="btn btn-primary" onClick={downloadTicket}>📥 Download Ticket</button>
                    <button className="btn btn-success" onClick={shareWhatsApp}>📱 Share via WhatsApp</button>
                    <button className="btn btn-blue" onClick={shareEmail}>📧 Send via Email</button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button className="btn btn-secondary" onClick={handleNewBooking}>🔄 Book Another Flight</button>
                </div>
            </div>
        </div>
    );
}
