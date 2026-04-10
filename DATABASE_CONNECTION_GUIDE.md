# MongoDB Connection Guide

This guide explains how to connect to the SkyWay Airlines database manually.

## Connection Details
- **URI:** `mongodb://localhost:27017/skyway_airlines`
- **Port:** `27017`
- **Database Name:** `skyway_airlines`

## 1. Using MongoDB Compass (GUI)
1. Open **MongoDB Compass**.
2. Click **"New Connection"**.
3. Paste the following URI in the connection string box:
   ```
   mongodb://localhost:27017/skyway_airlines
   ```
4. Click **Connect**.
5. You can now browse the `flights`, `hotels`, `users`, and `bookings` collections.

## 2. Using MongoDB Shell (mongosh)
1. Open your terminal or Command Prompt.
2. Run the following command:
   ```bash
   mongosh "mongodb://localhost:27017/skyway_airlines"
   ```
3. Once connected, you can run commands like:
   - `db.users.find()`
   - `db.flights.find().pretty()`

## 3. Manual Node.js Connection (Quick Test)
If you want to run a quick test script, create a file named `test-db.js` in the root:
```javascript
const mongoose = require('mongoose');
const uri = "mongodb://localhost:27017/skyway_airlines";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB manually!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection error:", err);
    process.exit(1);
  });
```

## Troubleshooting
- **Refused Connection:** Ensure the MongoDB service is running (check Task Manager or run `services.msc` and look for "MongoDB Server").
- **Empty Database:** If you see no data, run the `SEED-DATABASE.bat` script in the root directory.
