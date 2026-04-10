import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const BANKS = [
    { id: 'sbi', name: 'State Bank of India', short: 'SBI', color: '#1a237e', logo: '🏦' },
    { id: 'hdfc', name: 'HDFC Bank', short: 'HDFC', color: '#004c97', logo: '🏛️' },
    { id: 'icici', name: 'ICICI Bank', short: 'ICICI', color: '#f37b20', logo: '🏢' },
    { id: 'axis', name: 'Axis Bank', short: 'AXIS', color: '#97144d', logo: '🏪' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', short: 'Kotak', color: '#ed1c24', logo: '🏬' },
    { id: 'pnb', name: 'Punjab National Bank', short: 'PNB', color: '#005e73', logo: '🏗️' },
    { id: 'bob', name: 'Bank of Baroda', short: 'BOB', color: '#f26522', logo: '🏠' },
    { id: 'canara', name: 'Canara Bank', short: 'Canara', color: '#0055a5', logo: '🏭' },
];

const UPI_APPS = [
    { id: 'gpay', name: 'Google Pay', color: '#4285f4', bg: '#e8f0fe', icon: '🟢', suffix: '@okaxis', hint: 'yourname@okaxis' },
    { id: 'phonepe', name: 'PhonePe', color: '#5f259f', bg: '#f3e8ff', icon: '🟣', suffix: '@ybl', hint: 'yourname@ybl' },
    { id: 'paytm', name: 'Paytm', color: '#00b9f5', bg: '#e0f7fd', icon: '🔵', suffix: '@paytm', hint: 'yourname@paytm' },
    { id: 'bhim', name: 'BHIM UPI', color: '#1a8f3f', bg: '#e8f5e9', icon: '🇮🇳', suffix: '@upi', hint: 'yourname@upi' },
];

const VALID_COUPONS = {
    'HOTEL10': { discount: 0.10, label: '10% Off' },
    'RESORT20': { discount: 0.20, label: '20% Off' },
    'SPA15': { discount: 0.15, label: '15% Off' },
    'EARLY30': { discount: 0.30, label: '30% Off' },
    'WKND999': { flat: 999, label: '₹999 Off' },
    'FIRST15': { discount: 0.15, label: '15% Off' },
};

export default function HotelPayment() {
    const navigate = useNavigate();
    const { hotelBooking, generateHotelBookingId, setHotelBooking, confirmHotelBooking, getUpiUrl } = useBooking();

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);

    // Card fields
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // UPI fields
    const [selectedUpiApp, setSelectedUpiApp] = useState(null);
    const [upiId, setUpiId] = useState('');

    // Net Banking fields
    const [selectedBank, setSelectedBank] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifsc, setIfsc] = useState('');

    // Coupon on payment page
    const [couponInput, setCouponInput] = useState('');
    const [extraCoupon, setExtraCoupon] = useState(null);
    const [couponMsg, setCouponMsg] = useState('');

    if (!hotelBooking) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏨</div>
                <h2>No hotel booking found</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please select a hotel and click Book Now first.</p>
                <button className="btn btn-primary" onClick={() => navigate('/hotels')}>← Browse Hotels</button>
            </div>
        );
    }

    const { hotel, checkIn, checkOut, nights, subtotal, taxes, convenience } = hotelBooking;
    let baseCouponDiscount = hotelBooking.discount || 0;
    let extraDiscount = 0;
    if (extraCoupon) {
        extraDiscount = extraCoupon.flat ? Math.min(extraCoupon.flat, subtotal) : Math.round(subtotal * extraCoupon.discount);
    }
    const totalDiscount = baseCouponDiscount + extraDiscount;
    const finalTotal = subtotal + taxes + convenience - totalDiscount;

    // QR Logic
    const qrUrl = getUpiUrl(finalTotal, `Hotel ${hotel?.name}`);
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}`;

    const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    const formatExpiry = (val) => {
        const nums = val.replace(/\D/g, '').slice(0, 4);
        return nums.length >= 3 ? `${nums.slice(0, 2)}/${nums.slice(2)}` : nums;
    };

    const applyCoupon = () => {
        const code = couponInput.trim().toUpperCase();
        if (hotelBooking.appliedCoupon?.code === code) {
            setCouponMsg('⚠️ This coupon is already applied.');
            return;
        }
        if (VALID_COUPONS[code]) {
            setExtraCoupon({ code, ...VALID_COUPONS[code] });
            setCouponMsg(`✓ "${code}" applied — ${VALID_COUPONS[code].label}!`);
        } else {
            setCouponMsg('Invalid coupon. Try HOTEL10, RESORT20, or SPA15.');
            setExtraCoupon(null);
        }
    };

    const selectUpiApp = (app) => {
        setSelectedUpiApp(app);
        setUpiId(app.hint);
    };

    const isFormValid = () => {
        if (paymentMethod === 'card') return cardNumber.replace(/\s/g, '').length === 16 && cardName && expiry && cvv.length === 3;
        if (paymentMethod === 'upi') return upiId.length > 3 && upiId.includes('@');
        if (paymentMethod === 'bank') return selectedBank && accountNumber.length >= 9 && ifsc.length === 11;
        return false;
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (processing) return;
        if (!isFormValid()) return;
        setProcessing(true);

        try {
            console.log('Starting hotel payment processing...');
            let details = '';
            if (paymentMethod === 'card') {
                details = '**** **** **** ' + cardNumber.slice(-4);
            } else if (paymentMethod === 'upi') {
                details = upiId;
            } else if (paymentMethod === 'bank') {
                const bankName = BANKS.find(b => b.id === selectedBank)?.short || 'Bank';
                details = `${bankName} - Ends in ${accountNumber.slice(-4)}`;
            }

            const updatedBooking = {
                ...hotelBooking,
                discount: totalDiscount,
                total: finalTotal,
                paymentMethod,
                paymentDetails: details
            };
            
            setHotelBooking(updatedBooking);
            const bid = await confirmHotelBooking(updatedBooking, paymentMethod, details);
            
            if (bid) {
                console.log('Hotel booking confirmed with ID:', bid);
                navigate('/hotel-confirm');
            } else {
                alert('Booking failed. Please try again or check your connection.');
            }
        } catch (err) {
            console.error('Error during hotel payment:', err);
            alert('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const methodLabel = { card: '💳 Credit/Debit Card', upi: '📱 UPI / Digital Wallets', bank: '🏦 Net Banking' };

    return (
        <div className="page fade-in">
            {processing && (
                <div className="processing-overlay">
                    <div className="processing-spinner"></div>
                    <div className="processing-text">Processing your payment...</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Please do not close this window</p>
                </div>
            )}

            <div className="page-header">
                <h1>💳 Hotel Payment</h1>
                <p>Secure payment for your stay at {hotel.name}</p>
            </div>

            <div className="payment-layout">
                {/* Left: Payment Form */}
                <div className="payment-card-input">

                    {/* Method Tabs */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                        {['card', 'upi', 'bank'].map(m => (
                            <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                                style={{
                                    flex: 1, minWidth: '100px', padding: '0.65rem 0.5rem', borderRadius: 'var(--radius-md)',
                                    background: paymentMethod === m ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.1)',
                                    color: 'white', border: paymentMethod === m ? 'none' : '1px solid rgba(255,255,255,0.2)',
                                    cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', transition: 'all 0.3s'
                                }}>
                                {methodLabel[m]}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handlePay}>
                        {/* ── CARD ── */}
                        {paymentMethod === 'card' && (
                            <>
                                <div className="payment-card-visual" style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="card-chip">💳</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.8 }}>VISA / MC</span>
                                    </div>
                                    <div className="card-number">{cardNumber || '•••• •••• •••• ••••'}</div>
                                    <div className="card-bottom">
                                        <div><div className="card-label">Card Holder</div><div className="card-value">{cardName || 'YOUR NAME'}</div></div>
                                        <div><div className="card-label">Expires</div><div className="card-value">{expiry || 'MM/YY'}</div></div>
                                    </div>
                                </div>

                                <div className="form-group" style={{ position: 'relative', zIndex: 1 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>Card Number</label>
                                    <input className="form-input" placeholder="1234 5678 9012 3456"
                                        value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} required />
                                </div>
                                <div className="form-group" style={{ position: 'relative', zIndex: 1 }}>
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>Cardholder Name</label>
                                    <input className="form-input" placeholder="John Doe"
                                        value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} required />
                                </div>
                                <div className="payment-card-row" style={{ position: 'relative', zIndex: 1 }}>
                                    <div className="form-group">
                                        <label style={{ color: 'rgba(255,255,255,0.7)' }}>Expiry Date</label>
                                        <input className="form-input" placeholder="MM/YY"
                                            value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} required />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ color: 'rgba(255,255,255,0.7)' }}>CVV</label>
                                        <input className="form-input" type="password" placeholder="•••" maxLength={3}
                                            value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} required />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── UPI ── */}
                        {paymentMethod === 'upi' && (
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                    Choose your UPI app or enter UPI ID
                                </p>
                                {/* UPI App Tiles */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    {UPI_APPS.map(app => (
                                        <button key={app.id} type="button" onClick={() => selectUpiApp(app)}
                                            style={{
                                                background: selectedUpiApp?.id === app.id ? app.color : 'rgba(255,255,255,0.12)',
                                                border: selectedUpiApp?.id === app.id ? `2px solid ${app.color}` : '2px solid rgba(255,255,255,0.2)',
                                                borderRadius: '12px', padding: '0.85rem', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '0.6rem',
                                                color: '#fff', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.25s',
                                                transform: selectedUpiApp?.id === app.id ? 'scale(1.03)' : 'scale(1)'
                                            }}>
                                            <span style={{ fontSize: '1.5rem' }}>{app.icon}</span>
                                            <span>{app.name}</span>
                                            {selectedUpiApp?.id === app.id && <span style={{ marginLeft: 'auto', fontSize: '1rem' }}>✓</span>}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        background: 'white', padding: '1rem', display: 'inline-block',
                                        borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                                        boxShadow: '0 0 20px rgba(0,0,0,0.3)', border: '4px solid white'
                                    }}>
                                        <img src={qrImg} alt="UPI QR Code" style={{ width: '180px', height: '180px', display: 'block' }} />
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.2rem' }}>
                                        Scan QR code with any UPI app to pay
                                    </p>

                                    <button type="button" className="btn btn-primary" onClick={handlePay}
                                        style={{ background: 'var(--accent-gradient)', marginBottom: '0.5rem', width: '220px', fontSize: '0.85rem' }}>
                                        Simulator: Payment Successful ✅
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                                    <hr style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.2)' }} />
                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>OR ENTER UPI ID</span>
                                    <hr style={{ flex: 1, borderTop: '1px solid rgba(255,255,255,0.2)' }} />
                                </div>
                                <div className="form-group" style={{ textAlign: 'left' }}>
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>UPI ID (VPA)</label>
                                    <input className="form-input" placeholder="username@upi" value={upiId} onChange={e => setUpiId(e.target.value)} required />
                                </div>
                            </div>
                        )}

                        {/* ── NET BANKING ── */}
                        {paymentMethod === 'bank' && (
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                    Bank-to-bank transfer — secure and instant
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                    {BANKS.map(bank => (
                                        <button key={bank.id} type="button" onClick={() => setSelectedBank(bank.id)}
                                            style={{
                                                background: selectedBank === bank.id ? bank.color : 'rgba(255,255,255,0.1)',
                                                border: selectedBank === bank.id ? `2px solid ${bank.color}` : '2px solid rgba(255,255,255,0.2)',
                                                borderRadius: '10px', padding: '0.65rem 0.3rem', cursor: 'pointer',
                                                color: '#fff', fontWeight: 700, fontSize: '0.7rem', transition: 'all 0.25s',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem'
                                            }}>
                                            <span style={{ fontSize: '1.2rem' }}>{bank.logo}</span>
                                            <span>{bank.short}</span>
                                        </button>
                                    ))}
                                </div>

                                {selectedBank && (
                                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
                                        ✅ Selected: <strong>{BANKS.find(b => b.id === selectedBank)?.name}</strong>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>Account Number</label>
                                    <input className="form-input" placeholder="Enter your account number"
                                        value={accountNumber}
                                        onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 18))}
                                        required />
                                </div>
                                <div className="form-group">
                                    <label style={{ color: 'rgba(255,255,255,0.7)' }}>IFSC Code</label>
                                    <input className="form-input" placeholder="e.g. SBIN0001234"
                                        value={ifsc}
                                        onChange={e => setIfsc(e.target.value.toUpperCase().slice(0, 11))}
                                        required />
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.3rem' }}>
                                        11-character IFSC code (found on your cheque book or passbook)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Coupon on payment page */}
                        <div style={{ marginTop: '1rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input className="form-input"
                                    placeholder="Add another coupon code"
                                    value={couponInput}
                                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                                    style={{ flex: 1 }} />
                                <button type="button" onClick={applyCoupon}
                                    style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                    Apply 🏷️
                                </button>
                            </div>
                            {couponMsg && (
                                <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: couponMsg.startsWith('✓') ? '#4ade80' : '#fca5a5', fontWeight: 600 }}>
                                    {couponMsg}
                                </p>
                            )}
                        </div>

                        <button type="submit" className="btn btn-success"
                            style={{ width: '100%', marginTop: '1.25rem', position: 'relative', zIndex: 1, opacity: isFormValid() ? 1 : 0.6 }}
                            disabled={!isFormValid()}>
                            🔒 Pay ₹{finalTotal.toLocaleString()}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.75rem', position: 'relative', zIndex: 1 }}>
                            🔒 Secured with 256-bit SSL encryption · Demo mode — no real charges
                        </p>
                    </form>
                </div>

                {/* Right: Order Summary */}
                <div className="order-summary">
                    <h3 style={{ marginBottom: '1rem' }}>🏨 Booking Summary</h3>
                    <hr className="section-divider" />

                    {/* Hotel Info */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                        <img src={hotel.image} alt={hotel.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{hotel.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {hotel.city}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⭐ {hotel.rating}</div>
                        </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        📅 Check-in: <strong>{checkIn}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        📅 Check-out: <strong>{checkOut}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        🌙 <strong>{nights}</strong> night{nights !== 1 ? 's' : ''}
                    </div>
                    <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        👥 <strong>{hotelBooking.guests}</strong> guest{hotelBooking.guests !== 1 ? 's' : ''}
                    </div>

                    <hr className="section-divider" />

                    <div className="order-row"><span>Room rate × {nights} nights</span><span>₹{subtotal.toLocaleString()}</span></div>
                    <div className="order-row"><span>Taxes & fees (12%)</span><span>₹{taxes.toLocaleString()}</span></div>
                    <div className="order-row"><span>Convenience fee</span><span>₹{convenience}</span></div>
                    {baseCouponDiscount > 0 && (
                        <div className="order-row" style={{ color: '#059669' }}>
                            <span>Coupon ({hotelBooking.appliedCoupon?.code})</span>
                            <span>-₹{baseCouponDiscount.toLocaleString()}</span>
                        </div>
                    )}
                    {extraDiscount > 0 && (
                        <div className="order-row" style={{ color: '#059669' }}>
                            <span>Coupon ({extraCoupon?.code})</span>
                            <span>-₹{extraDiscount.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="order-row total">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString()}</span>
                    </div>

                    {/* Amenities */}
                    <hr className="section-divider" />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>INCLUDED AMENITIES</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {hotel.amenities.map(a => (
                            <span key={a} style={{ background: '#f1f5f9', color: 'var(--text-secondary)', borderRadius: '50px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', fontWeight: 600 }}>
                                ✓ {a}
                            </span>
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {['🔒 Secure Payment Gateway', '📋 Instant Booking Confirmation', '↩️ Free Cancellation (24h)'].map(badge => (
                            <div key={badge} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {badge}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
