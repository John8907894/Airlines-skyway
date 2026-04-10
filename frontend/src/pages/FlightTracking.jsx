import { useState } from 'react';

export default function FlightTracking() {
    const [flightNumber, setFlightNumber] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = (e) => {
        e.preventDefault();
        if (!flightNumber) return;
        setLoading(true);
        
        // Simulating API call
        setTimeout(() => {
            const flightData = {
                number: flightNumber.toUpperCase(),
                airline: 'SkyWay Airlines',
                status: 'In Air',
                origin: 'Mumbai (BOM)',
                destination: 'Dubai (DXB)',
                departure: '10:30 AM',
                arrival: '01:15 PM',
                delay: 'No Delay',
                altitude: '35,000 ft',
                speed: '850 km/h'
            };
            setTrackingResult(flightData);
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1>✈️ Flight Tracking</h1>
                <p>Track your flight status in real-time by flight number or route.</p>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto 2rem auto', padding: '2rem' }}>
                <form onSubmit={handleTrack}>
                    <div className="form-group">
                        <label>Flight Number</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input 
                                className="form-input" 
                                placeholder="e.g. SK123, AI456" 
                                value={flightNumber} 
                                onChange={(e) => setFlightNumber(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Tracking...' : 'Track Flight'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {trackingResult && (
                <div className="card fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{trackingResult.number}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>{trackingResult.airline}</p>
                        </div>
                        <div style={{ 
                            background: 'var(--success)', 
                            color: 'white', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '50px', 
                            fontWeight: 700 
                        }}>
                            {trackingResult.status}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{trackingResult.origin.split(' ')[0]}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{trackingResult.origin.split(' ')[1]}</div>
                            <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>{trackingResult.departure}</div>
                        </div>
                        
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 2rem' }}>
                            <div style={{ width: '100%', height: '2px', background: 'var(--border-glass)', position: 'relative' }}>
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '60%', 
                                    transform: 'translate(-50%, -50%)', 
                                    fontSize: '1.5rem' 
                                }}>✈️</div>
                            </div>
                            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {trackingResult.delay}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{trackingResult.destination.split(' ')[0]}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{trackingResult.destination.split(' ')[1]}</div>
                            <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>{trackingResult.arrival}</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
                        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Altitude</div>
                            <div style={{ fontWeight: 700 }}>{trackingResult.altitude}</div>
                        </div>
                        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Speed</div>
                            <div style={{ fontWeight: 700 }}>{trackingResult.speed}</div>
                        </div>
                    </div>
                </div>
            )}

            {!trackingResult && !loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📡</div>
                    <h3>Ready to track</h3>
                    <p style={{ marginTop: '0.5rem' }}>Enter a flight number to see its current position and status.</p>
                </div>
            )}
        </div>
    );
}
