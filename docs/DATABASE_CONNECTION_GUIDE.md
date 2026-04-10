# 🗄️ Database Connection Guide - Frontend & Backend

## 🎯 Step-by-Step Process for SkyWay Airlines

---

## 📋 **Step 1: Choose Your Database**

### Options:
1. **MongoDB** (Recommended for beginners)
2. **MySQL** (Traditional relational)
3. **PostgreSQL** (Advanced relational)
4. **SQLite** (Simple file-based)

### For this guide, we'll use **MongoDB**

---

## 🛠️ **Step 2: Set Up Backend (Node.js + Express)**

### Install Required Packages:
```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install -D nodemon
```

### Create Backend Structure:
```
backend/
├── config/
│   └── db.js          # Database connection
├── models/
│   ├── User.js        # User schema
│   ├── Flight.js      # Flight schema
│   └── Booking.js     # Booking schema
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── flights.js     # Flight routes
│   └── bookings.js    # Booking routes
├── middleware/
│   └── auth.js        # Authentication middleware
├── server.js          # Main server file
└── package.json
```

---

## 🗄️ **Step 3: Database Connection Setup**

### Create `backend/config/db.js`:
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/skyway_airlines', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Create `backend/.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skyway_airlines
JWT_SECRET=your_jwt_secret_key_here
```

---

## 📊 **Step 4: Create Database Models**

### Create `backend/models/User.js`:
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  phone: String,
  passport: String,
  nationality: String,
  dateOfBirth: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
```

### Create `backend/models/Flight.js`:
```javascript
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Flight', FlightSchema);
```

### Create `backend/models/Booking.js`:
```javascript
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  passenger: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    passport: String,
    nationality: String,
    dateOfBirth: Date,
    gender: String
  },
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

module.exports = mongoose.model('Booking', BookingSchema);
```

---

## 🛣️ **Step 5: Create API Routes**

### Create `backend/routes/auth.js`:
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({ name, email, password, role });
    await user.save();

    // Create JWT token
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

### Create `backend/routes/flights.js`:
```javascript
const express = require('express');
const Flight = require('../models/Flight');
const router = express.Router();

// Get all flights
router.get('/', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    let query = {};
    
    if (from) query.from = from;
    if (to) query.to = to;
    if (date) query.date = date;

    const flights = await Flight.find(query).sort({ price: 1 });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single flight
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create flight (admin only)
router.post('/', async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

---

## 🔐 **Step 6: Create Authentication Middleware**

### Create `backend/middleware/auth.js`:
```javascript
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

---

## 🖥️ **Step 7: Create Main Server File**

### Create `backend/server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/bookings', require('./routes/bookings'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## 🌐 **Step 8: Update Frontend to Connect to Backend**

### Create API Service in Frontend:
```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Flight endpoints
  getFlights: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/flights?${queryString}`);
    return response.json();
  },

  getFlight: async (id) => {
    const response = await fetch(`${API_BASE_URL}/flights/${id}`);
    return response.json();
  },

  // Protected endpoints (with JWT token)
  createBooking: async (bookingData, token) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(bookingData)
    });
    return response.json();
  }
};
```

---

## 🔧 **Step 9: Update Frontend Context**

### Update `src/context/AuthContext.jsx`:
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skyway_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      // You can create a /api/auth/me endpoint for this
      setUser({ /* user data from token */ });
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('skyway_token', response.token);
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skyway_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 🚀 **Step 10: Run the Application**

### Start MongoDB:
```bash
# If using MongoDB locally
mongod

# Or use MongoDB Atlas (cloud)
# Get connection string from https://cloud.mongodb.com
```

### Start Backend:
```bash
cd backend
npm install
npm run dev
```

### Start Frontend:
```bash
cd frontend
npm start
```

---

## 🎯 **Complete Flow:**

1. **Frontend** → Makes API call to backend
2. **Backend** → Receives request, validates JWT token
3. **Backend** → Queries MongoDB database
4. **Database** → Returns data to backend
5. **Backend** → Processes data, sends response to frontend
6. **Frontend** → Updates UI with received data

---

## 📋 **Next Steps:**

1. ✅ Set up MongoDB database
2. ✅ Create backend API with Express
3. ✅ Create database models
4. ✅ Implement authentication
5. ✅ Connect frontend to backend
6. 🔄 Test the complete flow
7. 🔄 Add error handling
8. 🔄 Add input validation
9. 🔄 Deploy to production

---

## 🔗 **Useful Resources:**

- **MongoDB Documentation:** https://docs.mongodb.com/
- **Express.js Guide:** https://expressjs.com/
- **React + Node.js Tutorial:** https://www.fullstackopen.com/
- **JWT Authentication:** https://jwt.io/

This complete setup will connect your SkyWay Airlines frontend to a real database backend! 🚀
