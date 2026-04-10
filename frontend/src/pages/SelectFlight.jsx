import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const formatTimeAMPM = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    
    const hr = parseInt(hours, 10);
    let tag = '';
    if (hr >= 5 && hr < 12) tag = '(Morning)';
    else if (hr >= 12 && hr < 17) tag = '(Afternoon)';
    else if (hr >= 17 && hr < 21) tag = '(Evening)';
    else tag = '(Night)';
    
    return { time: `${h}:${minutes} ${ampm}`, tag };
};

export default function SelectFlight() {
    const { selectedFlight } = useBooking();
    const navigate = useNavigate();

    if (!selectedFlight) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2>No flight selected</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Please search and select a flight first.</p>
                <button className="btn btn-primary" onClick={() => navigate('/search')} style={{ marginTop: '1.5rem' }}>
                    ← Back to Search
                </button>
            </div>
        );
    }

    const flight = selectedFlight;

    return (
        <div className="page">
            <div className="page-header">
                <h1>✅ Flight Selected</h1>
                <p>Review your selected flight details</p>
            </div>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeSlideUp 0.5s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '3rem' }}>{flight.airline.logo}</span>
                    <div>
                        <h2 style={{ fontSize: '1.5rem' }}>{flight.airline.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Flight {flight.id}</p>
                    </div>
                </div>

                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '2rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-glass)', marginBottom: '1.5rem'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{formatTimeAMPM(flight.departure).time}</div>
                        <div style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 600, marginTop: '-0.3rem', marginBottom: '0.5rem' }}>{formatTimeAMPM(flight.departure).tag}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{flight.from}</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{flight.duration}</div>
                        <div style={{
                            height: '2px', margin: '0 2rem',
                            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                            position: 'relative'
                        }}>
                            <span style={{ position: 'absolute', right: '-4px', top: '-8px', fontSize: '1rem' }}>✈️</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{formatTimeAMPM(flight.arrival).time}</div>
                        <div style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: 600, marginTop: '-0.3rem', marginBottom: '0.5rem' }}>{formatTimeAMPM(flight.arrival).tag}</div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{flight.to}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</div>
                        <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{flight.date}</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Seats</div>
                        <div style={{ fontWeight: 600, marginTop: '0.25rem', color: 'var(--success)' }}>{flight.seatsAvailable}</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Base Price</div>
                        <div style={{ fontWeight: 800, marginTop: '0.25rem', color: 'var(--accent-primary)', fontSize: '1.2rem' }}>₹{flight.price.toLocaleString()}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/search')}>← Change Flight</button>
                    <button className="btn btn-primary" onClick={() => navigate('/seats')}>Choose Seats →</button>
                </div>
            </div>
        </div>
    );
}
