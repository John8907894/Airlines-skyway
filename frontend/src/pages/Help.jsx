import React, { useState } from 'react';

const FAQS = [
    { q: 'How do I cancel my booking?', a: 'You can cancel your booking from the My Bookings section up to 24 hours before departure. Refunds are processed within 7 working days.' },
    { q: 'What is the baggage allowance?', a: 'Economy class allows 15kg check-in baggage and 7kg cabin baggage. Business class allows 30kg check-in and 10kg cabin baggage.' },
    { q: 'Can I reschedule my flight?', a: 'Yes, you can reschedule your flight up to 12 hours before departure. A rescheduling fee may apply depending on the fare type.' },
    { q: 'How do I get my boarding pass?', a: 'Your boarding pass is available in the My Bookings section once check-in opens (24 hours before departure). You can also download it as a PDF.' },
    { q: 'Is my payment information safe?', a: 'Yes, all payment data is encrypted using industry-standard SSL encryption. We never store your card details on our servers.' },
    { q: 'What are the check-in timings?', a: 'Online check-in opens 24 hours before departure and closes 2 hours before. Airport check-in counters close 1 hour before departure.' },
];

export default function Help() {
    const [openFaq, setOpenFaq] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1>🛟 Help & Support</h1>
                <p>We're here to help. Find answers or reach out to us.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* FAQs */}
                <div>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {FAQS.map((faq, idx) => (
                            <div key={idx} className="card" style={{ cursor: 'pointer', padding: '1.25rem' }} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{faq.q}</h4>
                                    <span style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', transition: 'transform 0.2s', transform: openFaq === idx ? 'rotate(45deg)' : 'none' }}>+</span>
                                </div>
                                {openFaq === idx && (
                                    <p style={{ marginTop: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Contact Support</h2>
                    {sent ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h3>Message Sent!</h3>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                Our support team will respond within 24 hours.
                            </p>
                            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => { setSent(false); setFormData({ name: '', email: '', message: '' }); }}>
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <div className="card">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <input className="form-input" placeholder="John Doe" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input className="form-input" type="email" placeholder="john@example.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>How can we help?</label>
                                    <textarea className="form-input" rows={5} placeholder="Describe your issue..." required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} style={{ resize: 'vertical' }} />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                            </form>
                        </div>
                    )}

                    {/* Quick Contact */}
                    <div className="card" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Quick Contact</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <span>📞</span>
                            <span style={{ fontSize: '0.9rem' }}>+91 1800-SKY-WAY (24/7 Helpline)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <span>📧</span>
                            <span style={{ fontSize: '0.9rem' }}>support@skywayair.com</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <span>💬</span>
                            <span style={{ fontSize: '0.9rem' }}>Live Chat via the chatbot below</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
