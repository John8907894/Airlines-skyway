import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const FAQ = {
    greet: { match: /hi|hello|hey|good\s*morning|good\s*evening|good\s*night|namaste/i, answers: ['Hello! Welcome to SkyWay Airlines ✈️ How can I help you today?', 'Hi there! Ready to take you somewhere amazing. How may I assist?', 'Hey! 👋 Great to see you. What can I do for you today?'] },
    book: { match: /book|flight|search|reserve|ticket/i, answers: ['To book a flight: go to 🔍 Search → choose your route and date → select a flight → pick seats → fill passenger details → pay. Done in 3 minutes! ✈️'] },
    hotel: { match: /hotel|resort|room|stay|lodge|accommodation/i, answers: ['For hotels: click 🏨 Hotels in the sidebar → search your city → click Book Now → choose dates & room type → proceed to payment. We have 12+ hotels across India!'] },
    cancel: { match: /cancel|cancellation/i, answers: ['Free cancellation is available up to 24 hours before departure/check-in. Go to My Bookings → select your booking → Cancel. Refund in 5–7 business days. 🔄'] },
    baggage: { match: /bag|luggage|weight|carry.?on/i, answers: ['Baggage policy: Economy – 15 kg check-in + 7 kg hand baggage. Business – 30 kg + 10 kg. Additional baggage can be purchased during booking or at the airport. 🧳'] },
    pay: { match: /pay|card|upi|qr|bank|transfer|credit|debit|payment/i, answers: ['We support 💳 Card, 📱 UPI, and 🏦 Bank Transfer. Your payment details (masked for security) are now stored and displayed on your ticket and in My Bookings for your reference. All transactions are SSL secured.'] },
    refund: { match: /refund|money.?back|return/i, answers: ['Refunds are processed within 5–7 business days to your original payment method. For UPI/card refunds: 5–7 days. For bank transfer: 7–10 days. You will receive an email confirmation. 💰'] },
    checkin: { match: /check.?in|boarding|web.?check/i, answers: ['Web check-in opens 48 hours before departure and closes 2 hours prior. Go to My Bookings → select your flight → Web Check-In. You can choose/change seats at this stage too! ✅'] },
    rewards: { match: /reward|point|miles|loyalty|tier|silver|gold|platinum/i, answers: ['With SkyWay Rewards 🏆, you earn 1 point per ₹10 spent on flights and hotels. Silver: 0–999 pts · Gold: 1000–4999 pts · Platinum: 5000+ pts. Redeem for discounts, upgrades & lounge access!'] },
    seat: { match: /seat|window|aisle|business|economy|premium/i, answers: ['Seat selection is available during booking after choosing your flight. Window, aisle, and business seats are available. Business class seats have extra legroom and priority boarding. 💺'] },
    offer: { match: /offer|discount|coupon|promo|deal|code/i, answers: ['Check out our 🎁 Offers page for exclusive deals! Current codes: EARLY30 (30% off), WKND999 (₹999 off), HOTEL10 (hotel 10% off), FIRST15 (15% first booking). Codes expire soon!'] },
    support: { match: /support|help|contact|problem|issue|complaint/i, answers: ['For support, visit the ❓ Help page or email support@skyway.com. We are available 24/7. For urgent issues call 1800-SKY-WAYS. Average response time: under 4 hours. 📞'] },
    default: { answers: ["I'm not sure about that. Try asking about booking, hotels, payment, baggage, rewards, or cancellations. 😊", "Hmm, I didn't get that. You can type: 'How to book?', 'Payment methods', 'Cancel my flight', etc.", "Let me connect you to more help! Visit our ❓ Help page or try rephrasing your question. I'm here to assist! 🤖"] },
};

const PAGE_CONTEXT = {
    '/search': '✈️ You\'re on the flight search page. Search by origin, destination, and date.',
    '/hotels': '🏨 You\'re on the Hotels page. Choose your city, dates, and room type.',
    '/payment': '💳 You\'re on the payment page. Choose Card, UPI/QR, or Bank Transfer.',
    '/hotel-payment': '💳 You\'re on hotel payment. All 3 payment methods are supported.',
    '/offers': '🎁 You\'re on the Offers page. Copy promo codes and apply them during checkout.',
    '/rewards': '🏆 You\'re on the Rewards page. See your points balance and redeem perks.',
};

function getBotResponse(msg, path) {
    const m = msg.toLowerCase();
    for (const key of Object.keys(FAQ).filter(k => k !== 'default')) {
        if (FAQ[key].match?.test(m)) {
            const arr = FAQ[key].answers;
            return arr[Math.floor(Math.random() * arr.length)];
        }
    }
    const da = FAQ.default.answers;
    return da[Math.floor(Math.random() * da.length)];
}

const SUGGESTIONS = ['How to book?', 'Baggage info', 'Payment methods', 'Refund policy', 'Rewards points', 'Hotel booking'];

const LANGS = {
    English: { placeholder: 'Type your question...', title: '✈️ SkyWay Assistant', welcome: 'Hello! Welcome to SkyWay ✈️ How can I help you?' },
    Hindi: { placeholder: 'अपना प्रश्न लिखें...', title: '✈️ स्काईवे सहायक', welcome: 'नमस्ते! स्काईवे में आपका स्वागत है ✈️' },
    Telugu: { placeholder: 'మీ ప్రశ్న టైప్ చేయండి...', title: '✈️ స్కైవే అసిస్టెంట్', welcome: 'నమస్కారం! స్కైవేకు స్వాగతం ✈️' },
    Tamil: { placeholder: 'உங்கள் கேள்வியை தட்டச்சு செய்யவும்...', title: '✈️ ஸ்கைவே உதவியாளர்', welcome: 'வணக்கம்! ஸ்கைவேக்கு வரவேற்கிறோம் ✈️' },
};

export default function Chatbot() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState('English');
    const [messages, setMessages] = useState([{ type: 'bot', text: LANGS.English.welcome, ts: new Date() }]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEnd = useRef(null);

    useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

    if (!isAuthenticated) return null;

    const ctxMsg = PAGE_CONTEXT[location.pathname];

    const handleLang = (e) => {
        const l = e.target.value;
        setLang(l);
        setMessages([{ type: 'bot', text: LANGS[l].welcome, ts: new Date() }]);
    };

    const sendMessage = (text) => {
        if (!text.trim()) return;
        setMessages(p => [...p, { type: 'user', text, ts: new Date() }]);
        setInput('');
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            setMessages(p => [...p, { type: 'bot', text: getBotResponse(text, location.pathname), ts: new Date() }]);
        }, 900 + Math.random() * 600);
    };

    const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };

    const toggleListen = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert("Speech recognition not supported in this browser."); return; }
        const r = new SR();
        r.lang = { Hindi: 'hi-IN', Telugu: 'te-IN', Tamil: 'ta-IN' }[lang] || 'en-US';
        r.onstart = () => setIsListening(true);
        r.onresult = (e) => { const t = e.results[0][0].transcript; setInput(t); setTimeout(() => sendMessage(t), 300); };
        r.onerror = () => setIsListening(false);
        r.onend = () => setIsListening(false);
        r.start();
    };

    const fmtTime = (d) => d?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) || '';

    return (
        <>
            <button className={`chatbot-trigger ${open ? 'active' : ''}`} onClick={() => setOpen(!open)}
                style={{ borderRadius: open ? '12px' : '50px', padding: open ? '0' : '0 1.5rem', width: open ? '60px' : 'auto', gap: '0.5rem' }}>
                {open ? '✕' : <><span style={{ fontSize: '1.2rem' }}>💬</span><span style={{ fontSize: '1rem', fontWeight: 600 }}>Chat</span></>}
            </button>

            {open && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ margin: 0 }}>{LANGS[lang].title}</h4>
                            <span style={{ fontSize: '0.7rem', color: '#a5f3fc', fontWeight: 500 }}>● Online · Usually replies instantly</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select value={lang} onChange={handleLang}
                                style={{ background: 'var(--bg-glass)', color: 'white', border: '1px solid var(--border-glass)', borderRadius: '4px', fontSize: '0.72rem', padding: '0.2rem' }}>
                                {Object.keys(LANGS).map(l => <option key={l} value={l} style={{ color: 'black' }}>{l}</option>)}
                            </select>
                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>
                    </div>

                    {/* Page context banner */}
                    {ctxMsg && (
                        <div style={{ background: 'rgba(99,102,241,0.15)', borderBottom: '1px solid rgba(99,102,241,0.2)', padding: '0.5rem 0.9rem', fontSize: '0.73rem', color: '#a5b4fc' }}>
                            📍 {ctxMsg}
                        </div>
                    )}

                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start', marginBottom: '0.75rem' }}>
                                {msg.type === 'bot' && (
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>✈️</div>
                                        <div className="chat-msg bot">{msg.text}</div>
                                    </div>
                                )}
                                {msg.type === 'user' && <div className="chat-msg user">{msg.text}</div>}
                                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.2rem', paddingLeft: msg.type === 'bot' ? '36px' : 0 }}>{fmtTime(msg.ts)}</span>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {typing && (
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>✈️</div>
                                <div className="chat-msg bot" style={{ padding: '0.6rem 1rem' }}>
                                    <span style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                        {[0, 1, 2].map(i => <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', display: 'inline-block', animation: `bounceDot 1.2s ${i * 0.2}s infinite` }} />)}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEnd} />
                    </div>

                    <div className="chat-suggestions">
                        {SUGGESTIONS.map(s => <button key={s} className="chat-suggestion" onClick={() => sendMessage(s)}>{s}</button>)}
                    </div>

                    <form className="chatbot-input" onSubmit={handleSubmit}>
                        <button type="button" onClick={toggleListen}
                            style={{ background: isListening ? 'var(--danger)' : 'var(--bg-glass)', color: isListening ? 'white' : 'var(--text-primary)', animation: isListening ? 'pulse 1.5s infinite' : 'none', borderRadius: '50px', padding: '0.6rem 0.8rem', border: '1px solid var(--border-glass)', cursor: 'pointer' }}>
                            🎤
                        </button>
                        <input value={input} onChange={e => setInput(e.target.value)} placeholder={LANGS[lang].placeholder} />
                        <button type="submit">➤</button>
                    </form>

                    <style>{`@keyframes bounceDot{0%,80%,100%{transform:scale(0);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
                </div>
            )}
        </>
    );
}
