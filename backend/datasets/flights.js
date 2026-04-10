export const airlines = [
  { code: 'AI', name: 'Air India', logo: '🇮🇳' },
  { code: 'SG', name: 'SpiceJet', logo: '🌶️' },
  { code: 'UK', name: 'Vistara', logo: '⭐' },
  { code: '6E', name: 'IndiGo', logo: '💙' },
  { code: 'EK', name: 'Emirates', logo: '🏆' },
  { code: 'SQ', name: 'Singapore Airlines', logo: '🦁' },
  { code: 'QR', name: 'Qatar Airways', logo: '🟤' },
  { code: 'BA', name: 'British Airways', logo: '🇬🇧' },
];

export const cities = [
  // --- INDIA: States & Districts ---
  // Andhra Pradesh
  'Visakhapatnam', 'Vijayawada', 'Tirupati', 'Rajahmundry', 'Kurnool', 'Kadapa',
  // Arunachal Pradesh
  'Itanagar (Hollongi)', 'Pasighat', 'Tezu', 'Zero',
  // Assam
  'Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Tezpur', 'North Lakhimpur',
  // Bihar
  'Patna', 'Gaya', 'Darbhanga',
  // Chhattisgarh
  'Raipur', 'Jagdalpur', 'Bilaspur',
  // Goa
  'Goa (Dabolim)', 'Goa (Mopa)',
  // Gujarat
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Bhuj', 'Jamnagar', 'Kandla', 'Porbandar',
  // Haryana
  'Ambala', 'Hisar',
  // Himachal Pradesh
  'Shimla', 'Kullu (Bhuntar)', 'Kangra (Gaggal)',
  // Jharkhand
  'Ranchi', 'Deoghar', 'Jamshedpur',
  // Karnataka
  'Bangalore (Bengaluru)', 'Mangalore (Mangaluru)', 'Hubli (Hubballi)', 'Belgaum (Belagavi)', 'Gulbarga (Kalaburagi)', 'Bellary (Ballari)', 'Mysore (Mysuru)', 'Bidar', 'Shimoga (Shivamogga)',
  // Kerala
  'Thiruvananthapuram', 'Kochi (Cochin)', 'Kozhikode (Calicut)', 'Kannur',
  // Madhya Pradesh
  'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Khajuraho',
  // Maharashtra
  'Mumbai', 'Pune', 'Nagpur', 'Shirdi', 'Nashik', 'Aurangabad', 'Kolhapur', 'Jalgaon', 'Nanded', 'Sindhudurg',
  // Manipur
  'Imphal',
  // Meghalaya
  'Shillong',
  // Mizoram
  'Aizawl',
  // Nagaland
  'Dimapur',
  // Odisha
  'Bhubaneswar', 'Jharsuguda', 'Jeypore', 'Rourkela',
  // Punjab
  'Amritsar', 'Ludhiana', 'Pathankot', 'Bathinda', 'Adampur',
  // Rajasthan
  'Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer', 'Bikaner', 'Kishangarh',
  // Sikkim
  'Pakyong',
  // Tamil Nadu
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tuticorin',
  // Telangana
  'Hyderabad',
  // Tripura
  'Agartala',
  // Uttar Pradesh
  'Lucknow', 'Varanasi', 'Kanpur', 'Agra', 'Gorakhpur', 'Prayagraj', 'Bareilly', 'Kushinagar', 'Hindon',
  // Uttarakhand
  'Dehradun', 'Pantnagar', 'Pithoragarh',
  // West Bengal
  'Kolkata', 'Bagdogra', 'Durgapur', 'Cooch Behar',
  // Union Territories
  'Port Blair', 'Chandigarh', 'Daman', 'Diu', 'New Delhi', 'Jammu', 'Srinagar', 'Leh', 'Puducherry', 'Agatti (Lakshadweep)',

  // --- INTERNATIONAL ---
  // Middle East
  'Dubai', 'Abu Dhabi', 'Sharjah', 'Doha', 'Muscat', 'Kuwait City', 'Manama', 'Riyadh', 'Jeddah', 'Istanbul',
  // Southeast Asia
  'Singapore', 'Bangkok', 'Kuala Lumpur', 'Phuket', 'Bali (Denpasar)', 'Jakarta', 'Manila', 'Hanoi', 'Ho Chi Minh City',
  // East Asia
  'Tokyo (Haneda)', 'Tokyo (Narita)', 'Seoul (Incheon)', 'Hong Kong', 'Beijing', 'Shanghai', 'Taipei', 'Osaka',
  // Europe
  'London (Heathrow)', 'London (Gatwick)', 'Paris (CDG)', 'Frankfurt', 'Amsterdam', 'Munich', 'Rome (Fiumicino)', 'Milan', 'Madrid', 'Barcelona', 'Zurich', 'Vienna', 'Copenhagen', 'Stockholm', 'Oslo', 'Helsinki', 'Athens', 'Lisbon', 'Dublin', 'Warsaw', 'Prague', 'Budapest',
  // North America
  'New York (JFK)', 'New York (Newark)', 'Los Angeles', 'San Francisco', 'Chicago (O\'Hare)', 'Houston', 'Washington (Dulles)', 'Atlanta', 'Miami', 'Dallas', 'Boston', 'Seattle', 'Las Vegas', 'Orlando', 'Toronto', 'Vancouver', 'Montreal', 'Mexico City',
  // Oceania
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Auckland',
  // Africa
  'Johannesburg', 'Cape Town', 'Cairo', 'Nairobi', 'Casablanca', 'Addis Ababa',
  // Latin America
  'Sao Paulo', 'Buenos Aires', 'Bogota', 'Lima', 'Santiago',
  // Favorites
  'Maldives', 'Bali, Indonesia', 'Paris, France', 'Manali, India', 'Santorini, Greece', 'Goa, India'
];

function generateSeatMap() {
  const rows = 30;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats = [];
  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const seatClass = r <= 3 ? 'first' : r <= 8 ? 'business' : 'economy';
      const price = seatClass === 'first' ? 5000 : seatClass === 'business' ? 3000 : 0;
      seats.push({
        id: `${r}${c}`,
        row: r,
        col: c,
        seatClass,
        extraPrice: price,
        isOccupied: Math.random() < 0.3,
      });
    }
  }
  return seats;
}

function randomTime() {
  const h = Math.floor(Math.random() * 24);
  const m = Math.random() < 0.5 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
}

function addHours(time, hours) {
  const [h, m] = time.split(':').map(Number);
  const totalMin = h * 60 + m + hours * 60;
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export function generateFlights(from, to, date) {
  const count = 4 + Math.floor(Math.random() * 5);
  const flights = [];
  for (let i = 0; i < count; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const dep = randomTime();
    const durationHrs = 1 + Math.floor(Math.random() * 14);
    const arr = addHours(dep, durationHrs);
    const basePrice = 2500 + Math.floor(Math.random() * 15000);
    flights.push({
      id: `${airline.code}-${1000 + Math.floor(Math.random() * 9000)}`,
      airline,
      from,
      to,
      date,
      departure: dep,
      arrival: arr,
      duration: `${durationHrs}h ${Math.random() < 0.5 ? '00' : '30'}m`,
      price: basePrice,
      stops: Math.random() < 0.4 ? 0 : Math.random() < 0.7 ? 1 : 2,
      gateNo: ['A1', 'A2', 'B4', 'C7', 'D2', 'E1'][Math.floor(Math.random() * 6)],
      seatsAvailable: 20 + Math.floor(Math.random() * 100),

      seatMap: generateSeatMap(),
    });
  }
  return flights.sort((a, b) => a.price - b.price);
}

export const bookingStats = {
  totalBookings: 12847,
  revenue: 2456000,
  activeFlights: 234,
  passengers: 34521,
  monthlyBookings: [
    { month: 'Jan', count: 980 },
    { month: 'Feb', count: 1120 },
    { month: 'Mar', count: 1340 },
    { month: 'Apr', count: 1050 },
    { month: 'May', count: 1560 },
    { month: 'Jun', count: 1780 },
  ],
  recentBookings: [
    { id: 'BK-001', passenger: 'Rahul Sharma', flight: 'AI-2045', route: 'DEL → BOM', amount: 5400, status: 'Confirmed' },
    { id: 'BK-002', passenger: 'Priya Patel', flight: '6E-3211', route: 'BLR → DEL', amount: 4200, status: 'Confirmed' },
    { id: 'BK-003', passenger: 'Amit Verma', flight: 'UK-1078', route: 'BOM → HYD', amount: 3800, status: 'Pending' },
    { id: 'BK-004', passenger: 'Sneha Gupta', flight: 'SG-5543', route: 'CCU → DEL', amount: 4900, status: 'Confirmed' },
    { id: 'BK-005', passenger: 'Vikram Singh', flight: 'EK-9012', route: 'DEL → DXB', amount: 18500, status: 'Confirmed' },
  ],
};

export const chatbotResponses = {
  greetings: [
    "Hello! Welcome to SkyWay Airlines ✈️ How can I help you today?",
    "Hi there! I'm your SkyWay booking assistant. What can I do for you?",
  ],
  booking: [
    "To book a flight, go to the Search page, enter your origin, destination and travel date, then select from available flights!",
    "You can search for flights from our homepage. Just enter your travel details and we'll show you the best options!",
  ],
  cancellation: [
    "For cancellations, please contact our support team at support@skyway.com or call 1800-SKY-HELP. Cancellation charges may apply based on your fare type.",
  ],
  baggage: [
    "Economy class allows 15kg check-in + 7kg cabin baggage. Business class allows 25kg check-in + 10kg cabin. First class allows 40kg check-in + 15kg cabin.",
  ],
  payment: [
    "We accept Credit/Debit cards (Visa, MasterCard, Amex), Net Banking, UPI, and digital wallets. All transactions are secured with 256-bit encryption.",
  ],
  refund: [
    "Refunds are processed within 7-10 business days to the original payment method. For instant refunds, you can opt for SkyWay wallet credits.",
  ],
  checkin: [
    "Web check-in opens 48 hours before departure. You can check in from our website or app. Don't forget to download your boarding pass!",
  ],
  default: [
    "I'm not sure about that. Could you try rephrasing your question? You can ask about booking, cancellation, baggage, payment, refunds, or check-in.",
    "I didn't quite understand. Try asking about: flight booking, baggage allowance, payment methods, refund policy, or web check-in.",
  ],
};
