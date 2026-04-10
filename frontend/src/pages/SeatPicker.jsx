import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function SeatPicker() {
    const { selectedFlight, selectedSeats, setSelectedSeats } = useBooking();
    const navigate = useNavigate();

    if (!selectedFlight) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2>No flight selected</h2>
                <button className="btn btn-primary" onClick={() => navigate('/search')} style={{ marginTop: '1rem' }}>← Back to Search</button>
            </div>
        );
    }

    const seatMap = selectedFlight.seatMap;
    const rows = [...new Set(seatMap.map(s => s.row))].sort((a, b) => a - b);
    const cols = [
        { id: 'A', type: 'Window' }, { id: 'B', type: 'Middle' }, { id: 'C', type: 'Aisle' },
        { id: 'D', type: 'Aisle' }, { id: 'E', type: 'Middle' }, { id: 'F', type: 'Window' }
    ];

    const toggleSeat = (seat) => {
        if (seat.isOccupied) return;
        if (selectedSeats.find(s => s.id === seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const getSeatClass = (seat) => {
        if (seat.isOccupied) return 'seat occupied';
        if (selectedSeats.find(s => s.id === seat.id)) return 'seat selected';
        return `seat available ${seat.seatClass}`;
    };

    const totalExtra = selectedSeats.reduce((sum, s) => sum + s.extraPrice, 0);

    return (
        <div className="page">
            <div className="page-header">
                <h1>🪑 Choose Your Seats</h1>
                <p>{selectedFlight.airline.name} — {selectedFlight.from} → {selectedFlight.to}</p>
            </div>

            <div className="seat-picker-layout">
                <div className="aircraft-body">
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                            ← FIRST CLASS (Rows 1-3) | BUSINESS (4-8) | ECONOMY (9-30) →
                        </span>
                    </div>

                    <div className="seat-grid">
                        <div className="seat-row" style={{ marginBottom: '0.5rem' }}>
                            <div className="row-number"></div>
                            {cols.map((c, i) => (
                                <React.Fragment key={c.id}>
                                    <div style={{ width: '36px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>{c.id}</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{c.type}</div>
                                    </div>
                                    {i === 2 && <div className="seat-aisle"></div>}
                                </React.Fragment>
                            ))}
                        </div>

                        {rows.map(row => (
                            <div key={row} className="seat-row">
                                <div className="row-number">{row}</div>
                                {cols.map((col, i) => {
                                    const seat = seatMap.find(s => s.row === row && s.col === col.id);
                                    return (
                                        <React.Fragment key={col.id}>
                                            <div
                                                className={getSeatClass(seat)}
                                                onClick={() => toggleSeat(seat)}
                                                title={`${seat.id} (${col.type}) - ${seat.seatClass}${seat.isOccupied ? ' (Occupied)' : seat.extraPrice ? ` (+₹${seat.extraPrice})` : ''}`}
                                            >
                                                {seat.isOccupied ? '×' : seat.id}
                                            </div>
                                            {i === 2 && <div className="seat-aisle"></div>}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="seat-legend">
                        <div className="seat-legend-item">
                            <div className="seat-legend-color" style={{ background: 'rgba(59, 130, 246, 0.2)', border: '2px solid rgba(59, 130, 246, 0.4)' }}></div>
                            Available
                        </div>
                        <div className="seat-legend-item">
                            <div className="seat-legend-color" style={{ background: 'rgba(245, 158, 11, 0.3)', border: '2px solid var(--accent-primary)' }}></div>
                            Selected
                        </div>
                        <div className="seat-legend-item">
                            <div className="seat-legend-color" style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)' }}></div>
                            Occupied
                        </div>
                    </div>
                </div>

                <div className="seat-summary">
                    <h3>🎫 Booking Summary</h3>
                    <hr className="section-divider" />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        Flight: <strong>{selectedFlight.id}</strong>
                    </p>

                    {selectedSeats.length > 0 ? (
                        <>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Selected seats:</p>
                            <div style={{ marginBottom: '1rem' }}>
                                {selectedSeats.map(s => (
                                    <span key={s.id} className="selected-seat-tag">
                                        {s.id}
                                        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>({s.seatClass})</span>
                                        <button onClick={() => toggleSeat(s)} style={{
                                            background: 'none', border: 'none', color: 'var(--accent-primary)',
                                            cursor: 'pointer', fontSize: '0.9rem', marginLeft: '0.25rem'
                                        }}>×</button>
                                    </span>
                                ))}
                            </div>
                            <hr className="section-divider" />
                            <div className="order-row"><span>Base fare ({selectedSeats.length} × ₹{selectedFlight.price.toLocaleString()})</span><span>₹{(selectedFlight.price * selectedSeats.length).toLocaleString()}</span></div>
                            {totalExtra > 0 && <div className="order-row"><span>Seat upgrade</span><span>₹{totalExtra.toLocaleString()}</span></div>}
                            <div className="order-row total"><span>Total</span><span>₹{(selectedFlight.price * selectedSeats.length + totalExtra).toLocaleString()}</span></div>
                        </>
                    ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                            Click on available seats to select them
                        </p>
                    )}

                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}
                        disabled={selectedSeats.length === 0} onClick={() => navigate('/details')}>
                        Continue →
                    </button>
                </div>
            </div>
        </div>
    );
}
