const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Hotel = require('../database/models/Hotel');

dotenv.config({ path: path.join(__dirname, '../../.env') });

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

async function updateHotelTypes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    for (const h of STATIC_HOTELS) {
      const result = await Hotel.updateOne({ name: h.name }, { $set: { type: h.type } });
      console.log(`Updated ${h.name}: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
    }

    console.log('Update complete');
    process.exit(0);
  } catch (error) {
    console.error('Error updating hotels:', error);
    process.exit(1);
  }
}

updateHotelTypes();
