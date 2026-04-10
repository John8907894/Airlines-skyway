const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel'],
    default: 'flight'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: function() { return this.bookingType === 'flight'; }
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: function() { return this.bookingType === 'hotel'; }
  },
  checkIn: String,
  checkOut: String,
  nights: Number,
  guests: Number,
  roomNo: String,
  passengers: [{

    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    passport: String,
    nationality: String,
    dateOfBirth: Date,
    gender: String
  }],
  seats: [{
    id: String,
    seatClass: String,
    extraPrice: Number
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'bank'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'confirmed'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema, 'my bookings');
