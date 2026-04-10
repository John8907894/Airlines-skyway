import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAVORITE_DESTINATIONS = [
    { id: 1, name: 'Maldives', tagline: 'Water Villas & Coral Reefs', price: 45000, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&q=80', rating: 4.9, category: 'Beach' },
    { id: 2, name: 'Bali, Indonesia', tagline: 'Ubud Rice Terraces & Temples', price: 28000, image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=500&q=80', rating: 4.8, category: 'Culture' },
    { id: 3, name: 'Paris, France', tagline: 'Eiffel Tower & Haute Cuisine', price: 65000, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80', rating: 4.9, category: 'City' },
    { id: 4, name: 'Manali, India', tagline: 'Snow Peaks & Adventure Trails', price: 12000, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=80', rating: 4.7, category: 'Adventure' },
    { id: 5, name: 'Santorini, Greece', tagline: 'Blue Domes & Sunset Views', price: 72000, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&q=80', rating: 4.9, category: 'Beach' },
    { id: 6, name: 'Goa, India', tagline: 'Golden Beaches & Island Life', price: 8500, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', rating: 4.6, category: 'Beach' },
];

export default function Favorites() {
    const [favorites, setFavorites] = useState(FAVORITE_DESTINATIONS);
    const navigate = useNavigate();

    const removeFavorite = (id) => {
        setFavorites(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1>❤️ My Favorites</h1>
                <p>Your saved dream destinations, ready to book.</p>
            </div>

            {favorites.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💔</div>
                    <h3>No Favorites Yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Start adding destinations you love from the search page!
                    </p>
                    <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/search')}>
                        Explore Destinations
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {favorites.map(dest => (
                        <div key={dest.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ position: 'relative', height: '200px' }}>
                                <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                                <button
                                    onClick={() => removeFavorite(dest.id)}
                                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,0,0,0.8)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Remove from Favorites"
                                >
                                    ❤️
                                </button>
                                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: '#fff' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{dest.name}</h3>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{dest.tagline}</p>
                                </div>
                            </div>
                            <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STARTING FROM</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>₹{dest.price.toLocaleString()}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <span style={{ background: '#f1f5f9', color: 'var(--text-secondary)', borderRadius: '50px', padding: '0.25rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {dest.category}
                                    </span>
                                    <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                                        onClick={() => navigate('/search', { state: { destination: dest.name } })}>
                                        Book Flight
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
