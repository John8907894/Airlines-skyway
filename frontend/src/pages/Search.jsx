import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { cities, generateFlights } from '@datasets/flights';
import { api } from '../services/api';
import Autocomplete from '../components/Autocomplete';

const formatTimeAMPM = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    const hr = parseInt(hours, 10);
    let tag = '';
    if (hr >= 5 && hr < 12) tag = ' (Morning)';
    else if (hr >= 12 && hr < 17) tag = ' (Afternoon)';
    else if (hr >= 17 && hr < 21) tag = ' (Evening)';
    else tag = ' (Night)';

    return `${h}:${minutes} ${ampm} ${tag}`;
};

const travelersSpots = [
    { id: 1, title: 'Water Vila', location: 'Rome, Italy', rating: 4.9, img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Ubud Rice Terrace', location: 'Bali, Indonesia', rating: 4.9, img: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
    { id: 3, title: 'Statue of Liberty', location: 'New York, USA', rating: 4.9, img: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { id: 4, title: 'Maafushi Island', location: 'Maldives', rating: 4.8, img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }
];

export default function Search() {
    const location = useLocation();
    const [from, setFrom] = useState('');
    const [to, setTo] = useState(location.state?.destination || '');

    useEffect(() => {
        if (location.state?.destination) {
            setTo(location.state.destination);
        }
    }, [location.state]);
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [travelClass, setTravelClass] = useState('economy');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [sortBy, setSortBy] = useState('price');
    const [activeFilter, setActiveFilter] = useState('Popular');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setSearchParams, setFlights, setSelectedFlight } = useBooking();
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!from || !to || !date) return;

        setLoading(true);
        setError('');
        try {
            const flights = await api.getFlights({ from, to, date });
            if (Array.isArray(flights)) {
                // Map backend flightNumber/ _id to id for frontend compatibility
                const mappedFlights = flights.map(f => ({
                    ...f,
                    id: f.id || f.flightNumber || f._id
                }));
                setResults(mappedFlights);
                setFlights(mappedFlights);
                setSearchParams({ from, to, date, passengers, travelClass });
                setSearched(true);
            } else {
                setError('Failed to fetch flights');
            }
        } catch (err) {
            setError('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (flight) => {
        setSelectedFlight(flight);
        navigate('/select');
    };

    const parseDuration = (dur) => {
        if (!dur) return 0;
        let total = 0;
        const hMatch = dur.match(/(\d+)h/);
        const mMatch = dur.match(/(\d+)m/);
        if (hMatch) total += parseInt(hMatch[1]) * 60;
        if (mMatch) total += parseInt(mMatch[1]);
        return total;
    };

    const sorted = [...results].sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'duration') return parseDuration(a.duration) - parseDuration(b.duration);
        return a.departure.localeCompare(b.departure);
    });

    const today = new Date().toISOString().split('T')[0];

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        if (filter === 'Near Me') navigate('/favorites');
        if (filter === 'Special Offers') navigate('/offers');
    };

    return (
        <div className="page" style={{ padding: '0', maxWidth: 'none' }}>
            {/* HERO SECTION */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Your Trip Starts Here</h1>
                    <p>Your all-in-one dashboard for booking, managing, and tracking flights with ease.</p>
                </div>

                <div className="hero-search-card">
                    <div className="search-tabs">
                        <button className="tab active" onClick={() => setSearched(false)}>✈️ Flight</button>
                        <button className="tab" onClick={() => navigate('/hotels')}>🏨 Hotel</button>
                    </div>

                    <form className="hero-search-form" onSubmit={handleSearch}>
                        <Autocomplete
                            options={cities}
                            value={from}
                            onChange={setFrom}
                            placeholder="Select origin"
                            label="From"
                            disabledOptions={[to]}
                        />
                        <Autocomplete
                            options={cities}
                            value={to}
                            onChange={setTo}
                            placeholder="Select destination"
                            label="Destination"
                            disabledOptions={[from]}
                        />

                        <div className="search-input-group">
                            <label>Date</label>
                            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="YYYY-MM-DD" required />
                        </div>
                        <div className="search-input-group">
                            <label>Passengers</label>
                            <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>
                                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary search-submit" disabled={loading}>
                            {loading ? (
                                <><span className="spinner-small"></span> Searching...</>
                            ) : 'Search'}
                        </button>
                    </form>
                    {error && <div className="search-error-message">{error}</div>}
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                {searched && (
                    <div className="flight-results-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.3rem' }}>{results.length} flights found</h2>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
                                {['price', 'duration', 'departure'].map(s => (
                                    <button key={s} onClick={() => setSortBy(s)}
                                        className={`sort-pill ${sortBy === s ? 'active' : ''}`}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {sorted.length > 0 ? (
                            sorted.map((flight, i) => (
                                <div key={flight.id} className="flight-card" onClick={() => handleSelect(flight)} style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="flight-airline">
                                        <div className="airline-logo">{flight.airline.logo}</div>
                                        <div className="airline-name">{flight.airline.name}</div>
                                    </div>
                                    <div className="flight-route">
                                        <div className="flight-time">
                                            <div className="time">{formatTimeAMPM(flight.departure)}</div>
                                            <div className="city">{flight.from}</div>
                                        </div>
                                        <div className="flight-line">
                                            <div className="duration">{flight.duration}</div>
                                            <div className="line"></div>
                                            <div className="stops">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
                                        </div>
                                        <div className="flight-time">
                                            <div className="time">{formatTimeAMPM(flight.arrival)}</div>
                                            <div className="city">{flight.to}</div>
                                        </div>
                                    </div>
                                    <div className="flight-price">
                                        <div className="price">₹{flight.price.toLocaleString()}</div>
                                        <div className="price-label">per person</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-flights-found">
                                <h3>No flights found</h3>
                                <p>We couldn't find any flights for your selected route and date. Try a different date or city.</p>
                                <button className="btn btn-secondary" onClick={() => setSearched(false)}>Back to Search</button>
                            </div>
                        )}
                    </div>
                )}

                {/* DESTINATIONS SECTION */}
                {!searched && (
                    <div className="destinations-section">
                        <div className="section-header">
                            <h2>Travelers Spot</h2>
                            <button className="btn-text" onClick={() => navigate('/favorites')}>See All</button>
                        </div>
                        <div className="destination-filters">
                            {['Popular', 'Near Me', 'Special Offers'].map(f => (
                                <span
                                    key={f}
                                    className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
                                    onClick={() => handleFilterClick(f)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {f}
                                </span>
                            ))}
                        </div>

                        <div className="destinations-grid">
                            {travelersSpots.map(spot => (
                                <div key={spot.id} className="destination-card" onClick={() => navigate('/favorites')}>
                                    <img src={spot.img} alt={spot.title} className="destination-image" />
                                    <div className="destination-overlay">
                                        <div className="destination-meta">
                                            <div>
                                                <h3>{spot.title}</h3>
                                                <p>📍 {spot.location}</p>
                                            </div>
                                            <div className="destination-rating">⭐ {spot.rating}</div>
                                        </div>
                                    </div>
                                    <div className="favorite-btn">❤️</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
