const mongoose = require('mongoose');
const Booking = require('./database/models/Booking');
const Flight = require('./database/models/Flight');
const User = require('./database/models/User');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

dotenv.config({ path: path.join(__dirname, '../.env') });

function makeRequest(bookingData, token) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(bookingData);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
        'Content-Length': Buffer.byteLength(dataString)
      }
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(dataString);
    req.end();
  });
}

async function runTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const flight = await Flight.findOne();
    const user = await User.findOne();
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ user: { id: user._id, role: user.role } }, process.env.JWT_SECRET || 'skyway_secret_key_2026', { expiresIn: '1h' });

    const bookingData = {
      bookingId: 'SKY-IDEMPOTENT-' + Date.now(),
      bookingType: 'flight',
      user: user._id,
      flight: flight._id,
      passengers: [{
        firstName: 'Test',
        lastName: 'Idempotent',
        email: 'test@example.com',
        phone: '1234567890',
        passport: 'A1234567',
        nationality: 'Indian',
        dob: '1990-01-01',
        gender: 'male'
      }],
      seats: [],
      totalPrice: 5000,
      paymentMethod: 'card',
      paymentDetails: '**** 1234'
    };

    console.log('--- FIRST REQUEST (Should Create) ---');
    const res1 = await makeRequest(bookingData, token);
    console.log(`Status 1: ${res1.status}`);
    console.log(`Booking ID Returns: ${res1.data.bookingId}`);

    console.log('\n--- SECOND REQUEST (Should be Idempotent) ---');
    const res2 = await makeRequest(bookingData, token);
    console.log(`Status 2: ${res2.status}`);
    console.log(`Booking ID Returns: ${res2.data.bookingId}`);

    if (res1.status === 201 && res2.status === 200 && res1.data.bookingId === res2.data.bookingId) {
        console.log('\n✅ Idempotency test passed successfully!');
    } else {
        console.log('\n❌ Idempotency test failed!');
    }

  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    process.exit(0);
  }
}

runTest();
