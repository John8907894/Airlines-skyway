const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Hotel = require('./database/models/Hotel');

// Load env vars exactly like server.js
dotenv.config({ path: path.join(__dirname, '../.env') });

const STATIC_HOTELS = [
    { name: 'The Grand Palace Hotel', type: 'Luxury Resort' },
    { name: 'Sea Breeze Resort', type: 'Beach Resort' },
    { name: 'Heritage Palace Inn', type: 'Heritage Hotel' },
    { name: 'Himalayan View Lodge', type: 'Mountain Lodge' },
    { name: 'Marina Bay Hotel', type: 'Business Hotel' },
    { name: 'Backwater Bliss Resort', type: 'Luxury Resort' },
    { name: 'Sunset Cliff Resort', type: 'Beach Resort' },
    { name: 'Royal Desert Camp', type: 'Heritage Hotel' },
    { name: 'Valley View Retreat', type: 'Mountain Lodge' },
    { name: 'Emerald Bay Resort', type: 'Luxury Resort' },
    { name: 'Tech Hub Suites', type: 'Business Hotel' },
    { name: 'Taj Meadows Resort', type: 'Luxury Resort' },
];

async function run() {
  try {
    const connectDB = require('./database/config/db');
    await connectDB();
    console.log('Connected!');

    for (const h of STATIC_HOTELS) {
      const result = await Hotel.updateOne({ name: h.name }, { $set: { type: h.type } });
      console.log(`Updated ${h.name}: matched ${result.matchedCount}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
