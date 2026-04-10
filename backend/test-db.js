const mongoose = require('mongoose');
const Booking = require('./database/models/Booking');

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const bookings = await Booking.find({});
    console.log(`Total bookings: ${bookings.length}`);
    const duplicateIds = {};
    bookings.forEach(b => {
      duplicateIds[b.bookingId] = (duplicateIds[b.bookingId] || 0) + 1;
    });
    for (const [id, count] of Object.entries(duplicateIds)) {
      if (count > 1) {
        console.log(`Duplicate found: ${id} x ${count}`);
      }
    }
    
    // Check if there are multiple bookings with the exact same ID
    console.log("Unique booking IDs:");
    console.log(Object.keys(duplicateIds));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
