const express = require('express');
const Booking = require('../database/models/Booking');
const Flight = require('../database/models/Flight');
const User = require('../database/models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Dashboard Statistics
router.get('/stats', [auth, adminAuth], async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeFlights = await Flight.countDocuments({ status: 'Active' });
    const users = await User.countDocuments();
    
    // Count users logged in last 24h
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeToday = await User.countDocuments({ lastLogin: { $gte: last24h } });
    
    const bookings = await Booking.find();
    const revenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('flight')
      .populate('hotel');

    // Simple monthly data calculation for chart
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = monthlyBookings.map(m => ({
      month: months[m._id - 1],
      count: m.count
    }));

    const flightBookingsCount = await Booking.countDocuments({ bookingType: 'flight' });
    const hotelBookingsCount = await Booking.countDocuments({ bookingType: 'hotel' });
    
    // Group by payment method
    const paymentBreakdown = await Booking.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
    ]);
    const paymentCounts = {};
    paymentBreakdown.forEach(p => { paymentCounts[p._id] = p.count; });

    res.json({
      totalBookings,
      revenue,
      activeFlights,
      flightBookingsCount,
      hotelBookingsCount,
      paymentCounts,
      passengers: users,
      activeToday,
      monthlyBookings: formattedMonthly,
      recentBookings: recentBookings.map(b => {
        let pName = 'N/A';
        if (b.passengers && b.passengers.length > 0) {
          pName = `${b.passengers[0].firstName} ${b.passengers[0].lastName}`;
          if (b.passengers.length > 1) pName += ` + ${b.passengers.length - 1} more`;
        } else if (b.passenger) {
          pName = `${b.passenger.firstName} ${b.passenger.lastName}`;
        }
        
        return {
          id: b.bookingId,
          passenger: pName,
          flight: b.bookingType === 'flight' ? (b.flight?.flightNumber || 'N/A') : (b.hotel?.name || 'Hotel'),
          route: b.bookingType === 'flight' ? (b.flight ? `${b.flight.from} → ${b.flight.to}` : 'N/A') : (b.hotel ? `Stay at ${b.hotel.city}` : 'N/A'),
          amount: b.totalPrice,
          status: b.bookingStatus,
          type: b.bookingType
        };
      })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create User (Admin Only)
router.post('/users', [auth, adminAuth], async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({ name, email, password, role: role || 'user' });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    console.error('Admin Create User Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get All Users
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User
router.put('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete User
router.delete('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Don't allow deleting self
    if (user._id.toString() === req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
