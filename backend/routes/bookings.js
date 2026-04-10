const express = require('express');
const Booking = require('../database/models/Booking');
const Flight = require('../database/models/Flight');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user bookings (protected)
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('flight').populate('hotel');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking (protected)
router.post('/', auth, async (req, res) => {
  try {
    const {
      bookingType = 'flight',
      flight: flightId,
      hotel: hotelId,
      checkIn,
      checkOut,
      nights,
      guests,
      passengers,
      seats,
      totalPrice,
      paymentMethod,
      bookingId
    } = req.body;

    // Handle Flight Booking Logic
    if (bookingType === 'flight') {
        const flight = await Flight.findById(flightId);
        if (!flight) {
            console.log(`❌ Booking failed: Flight ${flightId} not found`);
            return res.status(404).json({ message: 'Flight not found' });
        }

        if (flight.seatsAvailable < (seats?.length || 0)) {
            console.log(`❌ Booking failed: Not enough seats available for flight ${flightId}. Requested: ${seats?.length}, Available: ${flight.seatsAvailable}`);
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Check if selected seats are already occupied
        if (Array.isArray(seats) && seats.length > 0) {
            const selectedSeatIds = seats.map(s => s.id);
            const occupiedSeats = flight.seatMap.filter(seat => selectedSeatIds.includes(seat.id) && seat.isOccupied);
            if (occupiedSeats.length > 0) {
                console.log(`❌ Booking failed: Seats already occupied: ${occupiedSeats.map(s => s.id).join(', ')}`);
                return res.status(400).json({ message: 'One or more selected seats are already occupied', occupiedSeats: occupiedSeats.map(s => s.id) });
            }

            flight.seatMap = flight.seatMap.map(seat => {
                if (selectedSeatIds.includes(seat.id)) {
                    // Safety check: ensure we handle both Mongoose documents and plain objects
                    const seatData = typeof seat.toObject === 'function' ? seat.toObject() : seat;
                    return { ...seatData, isOccupied: true };
                }
                return seat;
            });
            flight.seatsAvailable -= seats.length;
            
            console.log(`📍 Updating seat map for flight ${flightId}. Seats: ${selectedSeatIds.join(', ')}`);
            await flight.save();
        } else if (bookingType === 'flight') {
            console.warn(`⚠️ Booking attempt for flight ${flightId} without specific seats.`);
        }
    }

    const newBooking = new Booking({
      bookingId,
      bookingType,
      user: req.user.id,
      flight: bookingType === 'flight' ? flightId : undefined,
      hotel: bookingType === 'hotel' ? hotelId : undefined,
      checkIn: bookingType === 'hotel' ? checkIn : undefined,
      checkOut: bookingType === 'hotel' ? checkOut : undefined,
      nights: bookingType === 'hotel' ? nights : undefined,
      guests: bookingType === 'hotel' ? guests : undefined,
      passengers,
      seats: bookingType === 'flight' ? seats : [],
      totalPrice,
      paymentMethod,
      paymentStatus: 'confirmed',
      bookingStatus: 'confirmed'
    });

    const booking = await newBooking.save();
    res.status(201).json(booking);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.bookingId && req.body.bookingId) {
        const existingBooking = await Booking.findOne({ bookingId: req.body.bookingId });
        if (existingBooking) {
            console.log(`♻️ Idempotent retry detected for booking ${req.body.bookingId}, returning existing.`);
            return res.status(200).json(existingBooking);
        }
    }
    console.error('SERVER ERROR DURING BOOKING:', error);
    try { require('fs').appendFileSync('error_log.txt', new Date().toISOString() + ' : ' + JSON.stringify(error, Object.getOwnPropertyNames(error)) + '\nBody: ' + JSON.stringify(req.body) + '\n\n'); } catch (e) {}
    if(error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', details: error.errors });
    }
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

module.exports = router;
