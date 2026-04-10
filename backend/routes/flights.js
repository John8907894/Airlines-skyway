const express = require('express');
const Flight = require('../database/models/Flight');
const router = express.Router();

function generateSeatMap() {
  const rows = 30;
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats = [];
  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const seatClass = r <= 3 ? 'first' : r <= 8 ? 'business' : 'economy';
      const price = seatClass === 'first' ? 5000 : seatClass === 'business' ? 3000 : 0;
      seats.push({ id: `${r}${c}`, row: r, col: c, seatClass, extraPrice: price, isOccupied: Math.random() < 0.2 });
    }
  }
  return seats;
}

async function generateMockFlights(from, to, date) {
  const airlines = [
    { name: 'SkyWay', logo: '✈️', code: 'SW' },
    { name: 'Air India', logo: '🇮🇳', code: 'AI' },
    { name: 'Indigo', logo: '💙', code: '6E' },
    { name: 'Qatar Airways', logo: '🟤', code: 'QR' }
  ];
  
  const flights = [];
  for (let i = 0; i < 4; i++) {
    const airline = airlines[i % airlines.length];
    const depH = 6 + i * 4;
    const dep = `${depH.toString().padStart(2, '0')}:00`;
    const arrH = (depH + 2) % 24;
    const arr = `${arrH.toString().padStart(2, '0')}:15`;
    
    flights.push({
      flightNumber: `${airline.code}${Math.floor(100 + Math.random() * 900)}`,
      airline,
      from,
      to,
      date,
      departure: dep,
      arrival: arr,
      duration: '2h 15m',
      price: 4000 + (i * 500),
      stops: 0,
      seatsAvailable: 60,
      seatMap: generateSeatMap()
    });
  }
  
  // Save generated flights to DB for persistence during this session
  return await Flight.insertMany(flights);
}

// Get all flights
router.get('/', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    let query = {};
    
    if (from) query.from = from;
    if (to) query.to = to;
    if (date) query.date = date;

    let flights = await Flight.find(query).sort({ price: 1 });
    
    // Fallback: If no flights found for a valid city search, generate some!
    if (flights.length === 0 && from && to && date) {
      flights = await generateMockFlights(from, to, date);
    }
    
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single flight
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create flight (admin only - should ideally have middleware)
router.post('/', async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
