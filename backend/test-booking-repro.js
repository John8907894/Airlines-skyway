const mongoose = require('mongoose');
const Booking = require('./backend/database/models/Booking');
const Flight = require('./backend/database/models/Flight');
const User = require('./backend/database/models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Get a flight
    const flight = await Flight.findOne();
    if (!flight) {
      console.log('No flights found');
      return;
    }

    // 2. Get a user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found');
      return;
    }

    const bookingData = {
      bookingId: 'TEST-' + Date.now(),
      bookingType: 'flight',
      user: user._id,
      flight: flight._id,
      passengers: [{
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        passport: 'A1234567',
        nationality: 'Indian',
        dob: '1990-01-01', // Frontend sends 'dob'
        gender: 'male'
      }],
      seats: [{
        id: flight.seatMap[0].id,
        seatClass: flight.seatMap[0].seatClass,
        extraPrice: flight.seatMap[0].extraPrice
      }],
      totalPrice: flight.price + (flight.seatMap[0].extraPrice || 0),
      paymentMethod: 'card',
      paymentDetails: '**** 1234'
    };

    console.log('Attempting to create booking...');
    
    // Simulate current backend logic
    const { flight: flightId, seats, bookingId, bookingType, passengers, totalPrice, paymentMethod } = bookingData;
    
    if (bookingType === 'flight') {
        const flightInDb = await Flight.findById(flightId);
        if (!flightInDb) throw new Error('Flight not found');

        if (seats && seats.length > 0) {
            const selectedSeatIds = seats.map(s => s.id);
            flightInDb.seatMap = flightInDb.seatMap.map(seat => {
                if (selectedSeatIds.includes(seat.id)) {
                    // Check if seat.toObject exists
                    const seatObj = seat.toObject ? seat.toObject() : seat;
                    return { ...seatObj, isOccupied: true };
                }
                return seat;
            });
            flightInDb.seatsAvailable -= seats.length;
            await flightInDb.save();
            console.log('Flight seat map updated');
        }
    }

    const newBooking = new Booking({
      bookingId,
      bookingType,
      user: user._id,
      flight: bookingType === 'flight' ? flightId : undefined,
      passengers,
      seats: bookingType === 'flight' ? seats : [],
      totalPrice,
      paymentMethod,
      paymentStatus: 'confirmed',
      bookingStatus: 'confirmed'
    });

    const savedBooking = await newBooking.save();
    console.log('Booking saved successfully:', savedBooking._id);

  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
