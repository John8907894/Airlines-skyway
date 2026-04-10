import React from 'react';

export default function PlaceholderPage({ title, icon, message }) {
    return (
        <div className="page fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="card" style={{ textAlign: 'center', padding: '4rem 3rem', maxWidth: '500px', width: '100%' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.8 }}>
                    {icon}
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    {title}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {message}
                </p>
                <button
                    style={{ marginTop: '2rem' }}
                    className="btn btn-primary"
                    onClick={() => window.history.back()}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
