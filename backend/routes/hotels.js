const express = require('express');
const Hotel = require('../database/models/Hotel');
const router = express.Router();

// Get all hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find({ active: true });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
