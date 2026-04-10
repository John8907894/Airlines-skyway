import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { api } from '../services/api';

const STATIC_HOTELS = [
    { id: 1, name: 'The Grand Palace Hotel', city: 'Mumbai', rating: 4.8, price: 4500, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', amenities: ['🛜 WiFi', '🏊 Pool', '💆 Spa', '💪 Gym'], type: 'Luxury Resort' },
    { id: 2, name: 'Sea Breeze Resort', city: 'Goa', rating: 4.6, price: 3200, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', amenities: ['🏖 Beach', '🛜 WiFi', '🏊 Pool', '🍹 Bar'], type: 'Beach Resort' },
    { id: 3, name: 'Heritage Palace Inn', city: 'Jaipur', rating: 4.7, price: 2800, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', amenities: ['🛜 WiFi', '🍽 Restaurant', '💆 Spa', '🅿️ Parking'], type: 'Heritage Hotel' },
    { id: 4, name: 'Himalayan View Lodge', city: 'Manali', rating: 4.5, price: 2200, image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80', amenities: ['🛜 WiFi', '🥾 Trekking', '🔥 Fireplace', '🅿️ Parking'], type: 'Mountain Lodge' },
    { id: 5, name: 'Marina Bay Hotel', city: 'Chennai', rating: 4.4, price: 3500, image: 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=400&q=80', amenities: ['🛜 WiFi', '🏊 Pool', '💪 Gym', '🍽 Restaurant'], type: 'Business Hotel' },
    { id: 6, name: 'Backwater Bliss Resort', city: 'Kochi', rating: 4.9, price: 5000, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', amenities: ['🛶 Houseboat', '🛜 WiFi', '💆 Spa', '🍽 Restaurant'], type: 'Luxury Resort' },
    { id: 7, name: 'Sunset Cliff Resort', city: 'Pondicherry', rating: 4.6, price: 3800, image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', amenities: ['🏖 Beach', '🛜 WiFi', '🍹 Bar', '🏊 Infinity Pool'], type: 'Beach Resort' },
    { id: 8, name: 'Royal Desert Camp', city: 'Jaisalmer', rating: 4.7, price: 4200, image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&q=80', amenities: ['🐪 Camel Safari', '🔭 Stargazing', '🍽 Restaurant', '💃 Cultural Show'], type: 'Heritage Hotel' },
    { id: 9, name: 'Valley View Retreat', city: 'Ooty', rating: 4.4, price: 2600, image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=400&q=80', amenities: ['🛜 WiFi', '🍵 Tea Garden', '🅿️ Parking', '🔥 Fireplace'], type: 'Mountain Lodge' },
    { id: 10, name: 'Emerald Bay Resort', city: 'Andaman', rating: 4.9, price: 6500, image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&q=80', amenities: ['🤿 Diving', '🏖 Private Beach', '🏊 Pool', '💆 Spa'], type: 'Luxury Resort' },
    { id: 11, name: 'Tech Hub Suites', city: 'Bangalore', rating: 4.3, price: 2900, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80', amenities: ['🛜 WiFi', '💪 Gym', '🍽 Restaurant', '🅿️ Parking'], type: 'Business Hotel' },
    { id: 12, name: 'Taj Meadows Resort', city: 'Coorg', rating: 4.8, price: 5500, image: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=400&q=80', amenities: ['☕ Plantation Tour', '💆 Spa', '🏊 Pool', '🍽 Restaurant'], type: 'Luxury Resort' },
];

const ROOM_TYPES = [
    { type: 'Standard', icon: '🛏️', multiplier: 1, desc: '1 Queen Bed · 30 sqm · City View' },
    { type: 'Deluxe', icon: '🛏️🛏️', multiplier: 1.4, desc: '2 Double Beds · 45 sqm · Garden View' },
    { type: 'Suite', icon: '👑', multiplier: 2.2, desc: 'King Bed · 80 sqm · Premium View · Jacuzzi' },
];

const VALID_COUPONS = {
    'HOTEL10': { discount: 0.10, label: '10% Off', description: 'Hotel Special' },
    'RESORT20': { discount: 0.20, label: '20% Off', description: 'Resort Discount' },
    'SPA15': { discount: 0.15, label: '15% Off', description: 'Spa Package' },
    'EARLY30': { discount: 0.30, label: '30% Off', description: 'Early Bird' },
    'WKND999': { flat: 999, label: '₹999 Off', description: 'Weekend Deal' },
    'FIRST15': { discount: 0.15, label: '15% Off', description: 'First Booking' },
};

const TYPES = ['All', 'Luxury Resort', 'Beach Resort', 'Heritage Hotel', 'Mountain Lodge', 'Business Hotel'];

function getDateStr(offset = 0) {
    const d = new Date(); d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
}
function diffDays(d1, d2) {
    const diff = (new Date(d2) - new Date(d1)) / 86400000;
    return diff > 0 ? diff : 1;
}

export default function Hotels() {
    const navigate = useNavigate();
    const { setHotelBooking } = useBooking();

    const [hotels, setHotels] = useState(STATIC_HOTELS);
    const [loading, setLoading] = useState(true);
    const [searchCity, setSearchCity] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [typeFilter, setTypeFilter] = useState('All');
    const [priceMax, setPriceMax] = useState(7000);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await api.getHotels();
                if (Array.isArray(data) && data.length > 0) {
                    setHotels(data);
                }
            } catch (err) {
                console.error('Failed to fetch hotels:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const handleSearch = () => { setSearched(true); };

    const displayHotels = hotels.filter(h => {
        const cityMatch = !searchCity || h.city.toLowerCase().includes(searchCity.toLowerCase());
        const typeMatch = typeFilter === 'All' || h.type === typeFilter;
        const priceMatch = h.price <= priceMax;
        return cityMatch && typeMatch && priceMatch;
    });

    const [selectedHotel, setSelectedHotel] = useState(null);
    const [modalCheckIn, setModalCheckIn] = useState(getDateStr(1));
    const [modalCheckOut, setModalCheckOut] = useState(getDateStr(3));
    const [modalGuests, setModalGuests] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0]);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    const openModal = (hotel) => {
        setSelectedHotel(hotel);
        setModalCheckIn(checkIn || getDateStr(1));
        setModalCheckOut(checkOut || getDateStr(3));
        setModalGuests(Number(guests) || 1);
        setSelectedRoom(ROOM_TYPES[0]);
        setAppliedCoupon(null);
        setCouponInput(''); setCouponError(''); setCouponSuccess('');
    };
    const closeModal = () => setSelectedHotel(null);

    const applyCoupon = () => {
        const code = couponInput.trim().toUpperCase();
        if (VALID_COUPONS[code]) {
            setAppliedCoupon({ code, ...VALID_COUPONS[code] });
            setCouponSuccess(`✓ "${code}" applied — ${VALID_COUPONS[code].label}!`);
            setCouponError('');
        } else {
            setCouponError('Invalid code. Try HOTEL10, RESORT20, SPA15, EARLY30.');
            setCouponSuccess(''); setAppliedCoupon(null);
        }
    };

    const nights = diffDays(modalCheckIn, modalCheckOut);
    const roomPrice = selectedHotel ? Math.round(selectedHotel.price * selectedRoom.multiplier) : 0;
    const subtotal = roomPrice * nights;
    const taxes = Math.round(subtotal * 0.12);
    const convenience = 99;
    let discount = 0;
    if (appliedCoupon) discount = appliedCoupon.flat ? Math.min(appliedCoupon.flat, subtotal) : Math.round(subtotal * appliedCoupon.discount);
    const total = subtotal + taxes + convenience - discount;

    const handleProceed = () => {
        setHotelBooking({ hotel: selectedHotel, roomType: selectedRoom.type, checkIn: modalCheckIn, checkOut: modalCheckOut, guests: modalGuests, nights, subtotal, taxes, convenience, discount, appliedCoupon, total });
        closeModal();
        navigate('/hotel-payment');
    };

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1>🏨 Hotels & Resorts</h1>
                <p>Choose from curated properties across India — hotels, resorts, heritage inns & mountain lodges</p>
            </div>

            {/* Search Bar */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.73rem', fontWeight: 700 }}>CITY / DESTINATION</label>
                        <input className="form-input" placeholder="e.g. Goa, Mumbai, Manali..." value={searchCity} onChange={e => setSearchCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.73rem', fontWeight: 700 }}>CHECK-IN</label>
                        <input className="form-input" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.73rem', fontWeight: 700 }}>CHECK-OUT</label>
                        <input className="form-input" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.73rem', fontWeight: 700 }}>GUESTS</label>
                        <select className="form-select" value={guests} onChange={e => setGuests(e.target.value)}>
                            {[1, 2, 3, 4, 5].map(n => <option key={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                        </select>
                    </div>
                    <button className="btn btn-primary" style={{ background: '#fff', color: '#2563eb', fontWeight: 700 }} onClick={handleSearch}>
                        🔍 Search
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600 }}>Filter:</span>
                    {TYPES.map(t => (
                        <button key={t} onClick={() => setTypeFilter(t)}
                            style={{ padding: '0.3rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: typeFilter === t ? '#fff' : 'rgba(255,255,255,0.15)', color: typeFilter === t ? '#2563eb' : '#fff', transition: 'all 0.2s' }}>
                            {t}
                        </button>
                    ))}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>Max ₹{priceMax.toLocaleString()}/night</span>
                        <input type="range" min={1500} max={7000} step={500} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{ width: '120px' }} />
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Showing {displayHotels.length} of {hotels.length} properties
            </div>

            {/* Hotel Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {displayHotels.map(hotel => (
                    <div key={hotel.id} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'var(--transition)' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                        <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                            <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} onMouseEnter={e => e.target.style.transform = 'scale(1.06)'} onMouseLeave={e => e.target.style.transform = ''} />
                            <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: '#2563eb', color: '#fff', borderRadius: '50px', padding: '0.25rem 0.6rem', fontSize: '0.78rem', fontWeight: 700 }}>⭐ {hotel.rating}</div>
                            <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', background: 'rgba(0,0,0,0.65)', color: '#fff', borderRadius: '50px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 600 }}>{hotel.type}</div>
                        </div>
                        <div style={{ padding: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.97rem', marginBottom: '0.3rem', fontWeight: 700 }}>{hotel.name}</h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>📍 {hotel.city}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                                {hotel.amenities.map(a => <span key={a} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--accent-secondary)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.68rem', fontWeight: 600 }}>{a}</span>)}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>₹{hotel.price.toLocaleString()}</span>
                                    <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>/night</span>
                                </div>
                                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => openModal(hotel)}>Book Now →</button>
                            </div>
                        </div>
                    </div>
                ))}
                {displayHotels.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏨</div>
                        <h3>No hotels found</h3>
                        <p style={{ marginTop: '0.5rem' }}>Try adjusting filters or searching a different city.</p>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {selectedHotel && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={closeModal}>
                    <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '580px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>
                        {/* Image */}
                        <div style={{ position: 'relative', height: '180px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                            <img src={selectedHotel.image} alt={selectedHotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />
                            <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', color: '#fff' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedHotel.name}</div>
                                <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>📍 {selectedHotel.city} · ⭐ {selectedHotel.rating} · {selectedHotel.type}</div>
                            </div>
                            <button onClick={closeModal} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {/* Dates */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                                {[['CHECK-IN', modalCheckIn, setModalCheckIn], ['CHECK-OUT', modalCheckOut, setModalCheckOut]].map(([lbl, val, setter]) => (
                                    <div key={lbl}>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>{lbl}</label>
                                        <input type="date" value={val} min={getDateStr(0)} onChange={e => setter(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.8rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>GUESTS</label>
                                <select value={modalGuests} onChange={e => setModalGuests(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem 0.8rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', background: '#fff' }}>
                                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                                </select>
                            </div>

                            {/* Room Type */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>ROOM TYPE</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {ROOM_TYPES.map(room => (
                                        <div key={room.type} onClick={() => setSelectedRoom(room)}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', border: `2px solid ${selectedRoom.type === room.type ? '#2563eb' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', background: selectedRoom.type === room.type ? '#eff6ff' : '#fff', transition: 'all 0.2s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                <span style={{ fontSize: '1.2rem' }}>{room.icon}</span>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{room.type}</div>
                                                    <div style={{ fontSize: '0.73rem', color: '#64748b' }}>{room.desc}</div>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.95rem' }}>₹{Math.round(selectedHotel.price * room.multiplier).toLocaleString()}/night</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Coupon */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>COUPON CODE</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input placeholder="HOTEL10, RESORT20, SPA15..." value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && applyCoupon()} style={{ flex: 1, padding: '0.6rem 0.8rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', outline: 'none' }} />
                                    <button onClick={applyCoupon} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.6rem 1rem', fontWeight: 700, cursor: 'pointer' }}>Apply</button>
                                </div>
                                {couponSuccess && <div style={{ color: '#059669', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: 600 }}>{couponSuccess}</div>}
                                {couponError && <div style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.4rem' }}>{couponError}</div>}
                            </div>

                            {/* Price Breakdown */}
                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                                {[
                                    [`₹${roomPrice.toLocaleString()} × ${nights} night${nights !== 1 ? 's' : ''} (${selectedRoom.type})`, subtotal],
                                    ['Taxes & fees (12%)', taxes],
                                    ['Convenience fee', convenience],
                                ].map(([label, val]) => (
                                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.4rem' }}>
                                        <span>{label}</span><span>₹{val.toLocaleString()}</span>
                                    </div>
                                ))}
                                {discount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#059669', fontWeight: 600, marginBottom: '0.4rem' }}>
                                        <span>Coupon discount ({appliedCoupon.code})</span><span>-₹{discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div style={{ height: '1px', background: '#e2e8f0', margin: '0.75rem 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>
                                    <span>Total</span><span style={{ color: '#2563eb' }}>₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button onClick={handleProceed} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, borderRadius: '12px' }}>
                                Proceed to Payment →
                            </button>
                            <p style={{ textAlign: 'center', fontSize: '0.73rem', color: '#94a3b8', marginTop: '0.75rem' }}>🔒 Free cancellation · 24h before check-in</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
