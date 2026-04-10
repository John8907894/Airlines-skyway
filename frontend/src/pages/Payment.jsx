import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

function SuccessOverlay({ total, method }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ textAlign: 'center', animation: 'fadeSlideUp 0.5s ease-out' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'bounceIn 0.6s ease-out' }}>✅</div>
                <h2 style={{ color: '#10b981', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Payment Successful!</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>₹{total.toLocaleString()} paid via {method}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Generating your ticket...</p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', animation: `bounceDot 1.2s ${i * 0.2}s infinite` }} />
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes bounceIn { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
                @keyframes bounceDot { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
            `}</style>
        </div>
    );
}

export default function Payment() {
    const { selectedFlight, selectedSeats, passengers, setPaymentStatus, confirmFlightBooking, getUpiUrl } = useBooking();
    const navigate = useNavigate();

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [upiId, setUpiId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!selectedFlight || !passengers || passengers.length === 0) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2>Please complete previous steps first</h2>
                <button className="btn btn-primary" onClick={() => navigate('/search')} style={{ marginTop: '1rem' }}>← Back to Search</button>
            </div>
        );
    }

    const totalExtra = selectedSeats.reduce((sum, s) => sum + s.extraPrice, 0);
    const baseFare = selectedFlight.price * selectedSeats.length;
    const taxes = Math.round(baseFare * 0.12);
    const convenienceFee = 199;
    const total = baseFare + totalExtra + taxes + convenienceFee;

    const qrUrl = getUpiUrl ? getUpiUrl(total, `Flight ${selectedFlight?.id}`) : `upi://pay?pa=skyway@upi&am=${total}&tn=Flight%20Booking`;
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`;

    const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    const formatExpiry = (val) => { const n = val.replace(/\D/g, '').slice(0, 4); return n.length >= 3 ? `${n.slice(0, 2)}/${n.slice(2)}` : n; };

    const methodLabel = paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI / QR Code' : 'Bank Transfer';

    const handlePay = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        // Prevent double submission
        if (processing) return;

        // Basic validation for card
        if (paymentMethod === 'card') {
            if (cardNumber.replace(/\s/g, '').length < 16) return alert('Invalid card number');
            if (cvv.length < 3) return alert('Invalid CVV');
        } else if (paymentMethod === 'upi' && !upiId.includes('@')) {
            return alert('Invalid UPI ID');
        }

        setProcessing(true);
        try {
            const currentBaseFare = selectedFlight.price * selectedSeats.length;
            const currentTotalExtra = selectedSeats.reduce((sum, s) => sum + (s.extraPrice || 0), 0);
            const currentTaxes = Math.round(currentBaseFare * 0.12);
            const totalPrice = currentBaseFare + currentTotalExtra + currentTaxes + 199;
            
            let details = '';
            if (paymentMethod === 'card') {
                details = '**** **** **** ' + cardNumber.slice(-4);
            } else if (paymentMethod === 'upi') {
                details = upiId;
            } else if (paymentMethod === 'bank') {
                details = 'Bank Ref: ' + (document.querySelector('input[placeholder*="UTR"]')?.value || 'SKY-REF');
            }

            const result = await confirmFlightBooking(selectedFlight, selectedSeats, passengers, totalPrice, paymentMethod, details);
            
            if (result && result.success) {
                setPaymentStatus('success');
                setShowSuccess(true);
                setTimeout(() => navigate('/ticket'), 2500);
            } else {
                alert(`Booking failed: ${result?.error || 'Unknown error'}. Please try again.`);
            }
        } catch (err) {
            console.error('Payment error:', err);
            alert('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const payMethods = [
        { id: 'card', icon: '💳', label: 'Card' },
        { id: 'upi', icon: '📱', label: 'UPI / QR' },
        { id: 'bank', icon: '🏦', label: 'Bank Transfer' },
    ];

    return (
        <div className="page">
            {showSuccess && <SuccessOverlay total={total} method={methodLabel} />}

            {processing && !showSuccess && (
                <div className="processing-overlay">
                    <div className="processing-spinner"></div>
                    <div className="processing-text">Processing your payment...</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Please do not close this window</p>
                </div>
            )}

            <div className="page-header">
                <h1>💳 Secure Payment</h1>
                <p>256-bit SSL encrypted · PCI DSS compliant</p>
            </div>

            <div className="payment-layout">
                <div className="payment-card-input">
                    {/* Payment Method Tabs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
                        {payMethods.map(m => (
                            <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                                style={{
                                    padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700,
                                    fontSize: '0.82rem', border: paymentMethod === m.id ? 'none' : '1px solid var(--border-glass)',
                                    background: paymentMethod === m.id ? 'var(--accent-gradient)' : 'var(--bg-glass)',
                                    color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                                    boxShadow: paymentMethod === m.id ? '0 4px 15px rgba(99,102,241,0.4)' : 'none',
                                    transition: 'all 0.2s'
                                }}>
                                <span style={{ fontSize: '1.4rem' }}>{m.icon}</span>
                                <span>{m.label}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handlePay}>
                        {/* CARD */}
                        {paymentMethod === 'card' && (
                            <>
                                <div className="payment-card-visual" style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="card-chip">💳</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.8 }}>VISA</span>
                                    </div>
                                    <div className="card-number">{cardNumber || '•••• •••• •••• ••••'}</div>
                                    <div className="card-bottom">
                                        <div><div className="card-label">Card Holder</div><div className="card-value">{cardName || 'YOUR NAME'}</div></div>
                                        <div><div className="card-label">Expires</div><div className="card-value">{expiry || 'MM/YY'}</div></div>
                                    </div>
                                </div>
                                <div className="form-group" style={{ position: 'relative', zIndex: 1 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>Card Number</label>
                                    <input className="form-input" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} required />
                                </div>
                                <div className="form-group" style={{ position: 'relative', zIndex: 1 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>Cardholder Name</label>
                                    <input className="form-input" placeholder="Name on card" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} required />
                                </div>
                                <div className="payment-card-row" style={{ position: 'relative', zIndex: 1 }}>
                                    <div className="form-group">
                                        <label style={{ color: 'rgba(255,255,255,0.7)' }}>Expiry Date</label>
                                        <input className="form-input" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ color: 'rgba(255,255,255,0.7)' }}>CVV</label>
                                        <input className="form-input" type="password" placeholder="•••" maxLength={3} value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} required />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* UPI / QR */}
                        {paymentMethod === 'upi' && (
                            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                                    <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', boxShadow: '0 0 30px rgba(0,0,0,0.4)', border: '4px solid white' }}>
                                        <img src={qrImg} alt="UPI QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
                                    </div>
                                    {/* Scan line animation */}
                                    <div style={{ position: 'absolute', left: '1rem', right: '1rem', height: '2px', background: 'linear-gradient(90deg, transparent, #6366f1, transparent)', animation: 'scanLine 2s linear infinite', boxShadow: '0 0 10px #6366f1' }} />
                                </div>
                                <p style={{ color: '#a5b4fc', fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem' }}>Scan with any UPI app</p>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginBottom: '1.5rem' }}>PhonePe · GPay · Paytm · BHIM</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {['PhonePe 💜', 'GPay 🔵', 'Paytm 🔷', 'BHIM 🇮🇳'].map(app => (
                                        <div key={app} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{app}</div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                                    <hr style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.2)' }} />
                                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>OR ENTER UPI ID</span>
                                    <hr style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.2)' }} />
                                </div>
                                <div className="form-group" style={{ textAlign: 'left' }}>
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>UPI ID</label>
                                    <input className="form-input" placeholder="username@upi" value={upiId} onChange={e => setUpiId(e.target.value)} required />
                                </div>
                            </div>
                        )}

                        {/* BANK TRANSFER */}
                        {paymentMethod === 'bank' && (
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                                    <div style={{ fontWeight: 700, color: '#a5b4fc', marginBottom: '0.85rem', fontSize: '0.88rem' }}>🏦 Transfer to SkyWay Bank Account</div>
                                    {[
                                        ['Bank Name', 'SkyWay National Bank'],
                                        ['Account Name', 'SkyWay Airlines Pvt Ltd'],
                                        ['Account Number', '1234 5678 9012 3456'],
                                        ['IFSC Code', 'SKYW0001234'],
                                        ['Branch', 'Mumbai – BKC (Main)'],
                                        ['Reference', `SKYFLT-${selectedFlight?.id}-${Date.now().toString().slice(-6)}`],
                                    ].map(([label, val]) => (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>{label}</span>
                                            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: label === 'Reference' ? '#10b981' : 'var(--text-primary)' }}>{val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#fbbf24' }}>
                                    ⚠️ Transfer ₹{total.toLocaleString()} and use reference number. Confirmation within 2–4 hours.
                                </div>
                                <div className="form-group">
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>Transaction Reference / UTR Number</label>
                                    <input className="form-input" placeholder="e.g. UTR123456789012" required />
                                </div>
                                <div className="form-group">
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>Your Bank Name</label>
                                    <input className="form-input" placeholder="e.g. SBI, HDFC, Axis..." required />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-success" disabled={processing} style={{ width: '100%', marginTop: '1.25rem', padding: '0.95rem', fontSize: '1.05rem', fontWeight: 700, position: 'relative', zIndex: 1, opacity: processing ? 0.7 : 1, cursor: processing ? 'not-allowed' : 'pointer' }}>
                            🔒 {processing ? 'Processing...' : (paymentMethod === 'bank' ? 'Confirm Bank Transfer' : `Pay ₹${total.toLocaleString()}`)}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.73rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.75rem' }}>
                            🔒 256-bit SSL · Demo — no real charges
                        </p>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <h3 style={{ marginBottom: '1rem' }}>📋 Order Summary</h3>
                    <hr className="section-divider" />
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{selectedFlight.airline.logo}</span>
                        <div>
                            <div style={{ fontWeight: 600 }}>{selectedFlight.airline.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Flight {selectedFlight.id}</div>
                        </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{selectedFlight.from} → {selectedFlight.to}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{selectedFlight.date} · {selectedFlight.departure} - {selectedFlight.arrival}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Seats: {selectedSeats.map(s => s.id).join(', ')}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Passengers: {passengers[0].firstName} {passengers[0].lastName}
                        {passengers.length > 1 && ` + ${passengers.length - 1} more`}
                    </div>
                    <hr className="section-divider" />
                    <div className="order-row"><span>Base fare ({selectedSeats.length} pax)</span><span>₹{baseFare.toLocaleString()}</span></div>
                    {totalExtra > 0 && <div className="order-row"><span>Seat upgrade</span><span>₹{totalExtra.toLocaleString()}</span></div>}
                    <div className="order-row"><span>Taxes & fees</span><span>₹{taxes.toLocaleString()}</span></div>
                    <div className="order-row"><span>Convenience fee</span><span>₹{convenienceFee}</span></div>
                    <div className="order-row total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>

                    <div style={{ marginTop: '1.25rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>🏆 +{Math.floor(total / 10)} Reward Points</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Added to your account on success</div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scanLine {
                    0% { top: 16px; }
                    50% { top: calc(100% - 20px); }
                    100% { top: 16px; }
                }
            `}</style>
        </div>
    );
}
