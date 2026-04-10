const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address: String,
  description: String,

  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  image: String,
  amenities: [String],
  roomTypes: [{
    name: String,
    price: Number,
    capacity: Number
  }],
  active: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hotel', HotelSchema, 'Hotels & Resorts');
