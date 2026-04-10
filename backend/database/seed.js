const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');
const Hotel = require('./models/Hotel');
const User = require('./models/User');
const Booking = require('./models/Booking');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

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
        isOccupied: Math.random() < 0.2,
      });
    }
  }
  return seats;
}

const hotels = [
  { name: 'The Grand Palace Hotel', city: 'Mumbai', address: '123 Marine Drive, Mumbai, Maharashtra', rating: 4.8, price: 4500, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80', amenities: ['🛜 WiFi', '🏊 Pool', '💆 Spa', '💪 Gym'], type: 'Luxury Hotel' },
  { name: 'Sea Breeze Resort', city: 'Goa', address: '45 Beach Road, Calangute, Goa', rating: 4.6, price: 3200, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80', amenities: ['🏖 Beach', '🛜 WiFi', '🏊 Pool', '🍹 Bar'], type: 'Beach Resort' },
  { name: 'Heritage Palace Inn', city: 'Jaipur', address: '88 Palace View, Jaipur, Rajasthan', rating: 4.7, price: 2800, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', amenities: ['🛜 WiFi', '🍽 Restaurant', '💆 Spa', '🅿️ Parking'], type: 'Heritage Hotel' },
  { name: 'Himalayan View Lodge', city: 'Manali', address: '12 Mall Road, Manali, Himachal Pradesh', rating: 4.5, price: 2200, image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80', amenities: ['🛜 WiFi', '🥾 Trekking', '🔥 Fireplace', '🅿️ Parking'], type: 'Mountain Lodge' },
  { name: 'Marina Bay Hotel', city: 'Chennai', address: '56 Marina Drive, Chennai, Tamil Nadu', rating: 4.4, price: 3500, image: 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=400&q=80', amenities: ['🛜 WiFi', '🏊 Pool', '💪 Gym', '🍽 Restaurant'], type: 'Business Hotel' },
  { name: 'Backwater Bliss Resort', city: 'Kochi', address: '77 Backwater Vista, Kochi, Kerala', rating: 4.9, price: 5000, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', amenities: ['🛶 Houseboat', '🛜 WiFi', '💆 Spa', '🍽 Restaurant'], type: 'Luxury Resort' }
];


const flights = [
  {
    flightNumber: 'SW101',
    airline: { name: 'SkyWay', logo: '✈️', code: 'SW' },
    from: 'Mumbai',
    to: 'Delhi',
    departure: '08:00',
    arrival: '10:15',
    date: '2026-03-20',
    duration: '2h 15m',
    price: 4500,
    stops: 0,
    gateNo: 'A1',
    seatsAvailable: 50,

    seatMap: generateSeatMap()
  },
  {
    flightNumber: 'SW102',
    airline: { name: 'SkyWay', logo: '✈️', code: 'SW' },
    from: 'Mumbai',
    to: 'Delhi',
    departure: '14:30',
    arrival: '16:45',
    date: '2026-03-20',
    duration: '2h 15m',
    price: 5200,
    stops: 0,
    seatsAvailable: 45,
    seatMap: generateSeatMap()
  },
  {
    flightNumber: 'SW201',
    airline: { name: 'SkyWay', logo: '✈️', code: 'SW' },
    from: 'Delhi',
    to: 'Bangalore',
    departure: '09:00',
    arrival: '11:45',
    date: '2026-03-21',
    duration: '2h 45m',
    price: 6300,
    stops: 0,
    seatsAvailable: 30,
    seatMap: generateSeatMap()
  },
  {
    flightNumber: 'SW301',
    airline: { name: 'SkyWay', logo: '✈️', code: 'SW' },
    from: 'Chennai',
    to: 'Kolkata',
    departure: '11:00',
    arrival: '13:30',
    date: '2026-03-22',
    duration: '2h 30m',
    price: 4800,
    stops: 0,
    seatsAvailable: 60,
    seatMap: generateSeatMap()
  },
{
    flightNumber: 'SW501',
    airline: { name: 'SkyWay', logo: '✈️', code: 'SW' },
    from: 'Vishakapatam',
    to: 'Hyderabad',
    departure: '11:00',
    arrival: '13:30',
    date: '2026-01-22',
    duration: '2h 30m',
    price: 4800,
    stops: 0,
    seatsAvailable: 70,
    seatMap: generateSeatMap()
  },
  {
    flightNumber: 'SW601',
    airline: { name: 'SkyWay', logo: '✈️', code: 'SW' },
    from: 'Kuala Lumpur',
    to: 'Bangkok',
    departure: '10:30',
    arrival: '12:45',
    date: '2026-04-10',
    duration: '2h 15m',
    price: 8500,
    stops: 0,
    seatsAvailable: 80,
    seatMap: generateSeatMap()
  },
  {
    flightNumber: 'SW602',
    airline: { name: 'SkyWay', logo: '✈️', code: 'SW' },
    from: 'Bangkok',
    to: 'Kuala Lumpur',
    departure: '15:20',
    arrival: '17:35',
    date: '2026-04-12',
    duration: '2h 15m',
    price: 8200,
    stops: 0,
    seatsAvailable: 75,
    seatMap: generateSeatMap()
  }
];


const users = [
  {
    name: 'Admin User',
    email: 'admin@skyway.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Demo User',
    email: 'user@skyway.com',
    password: 'user123',
    role: 'user'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    await Flight.deleteMany();
    await Hotel.deleteMany();
    await Booking.deleteMany();
    await User.deleteMany(); // Warning: This clears all users!
    
    console.log('Cleared existing collections...');
    
    await Flight.insertMany(flights);
    console.log('Inserted seed flight data!');
    
    await Hotel.insertMany(hotels);
    console.log('Inserted seed hotel data!');

    // Using save in a loop to trigger the pre('save') password hashing middleware
    for (const userData of users) {
        const user = new User(userData);
        await user.save();
    }
    console.log('Inserted seed user data!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
