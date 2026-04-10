const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  airline: {
    name: String,
    logo: String,
    code: String
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  departure: {
    type: String,
    required: true
  },
  arrival: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  duration: String,
  price: {
    type: Number,
    required: true
  },
  stops: {
    type: Number,
    default: 0
  },
  seatsAvailable: {
    type: Number,
    default: 180
  },
  seatMap: [{
    id: String,
    row: Number,
    col: String,
    seatClass: String,
    extraPrice: Number,
    isOccupied: Boolean
  }],
  status: {
    type: String,
    enum: ['Active', 'Delayed', 'Cancelled'],
    default: 'Active'
  },
  gateNo: {
    type: String,
    default: 'A1'
  },
  createdAt: {

    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Flight', FlightSchema);
