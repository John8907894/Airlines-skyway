const mongoose = require('mongoose');
const Flight = require('./database/models/Flight');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkFlights() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const flights = await Flight.find();
    let fullyBookedCount = 0;
    
    console.log(`Checking ${flights.length} total flights in the database...`);
    for (const f of flights) {
      if (f.seatsAvailable <= 0) {
        fullyBookedCount++;
        console.log(`Flight Full: ${f.flightNumber} from ${f.from} to ${f.to} | Total Capacity: ${f.seatMap.length} | Available: ${f.seatsAvailable}`);
      } else if (f.seatsAvailable < 5) {
        console.log(`Flight Almost Full: ${f.flightNumber} from ${f.from} to ${f.to} | Total Capacity: ${f.seatMap.length} | Available: ${f.seatsAvailable}`);
      }
    }
    
    console.log(`Total fully booked flights: ${fullyBookedCount}`);
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkFlights();
