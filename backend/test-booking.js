const jwt = require('jsonwebtoken');

const token = jwt.sign({ user: { id: "651234567890123456789012", role: "user" } }, "skyway_secret_key_2026");

console.log("Token:", token);

fetch('http://localhost:5000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': token
  },
  body: JSON.stringify({
    bookingId: "SKY-TEST-12345",
    bookingType: 'flight',
    flight: "651234567890123456789012", // dummy valid ObjectId
    totalPrice: 5000,
    paymentMethod: 'card',
    seats: [{ id: "1A", seatClass: "economy", extraPrice: 0 }],
    passengers: [{ firstName: "Test", lastName: "User" }]
  })
})
  .then(async r => {
    console.log("Status:", r.status);
    const text = await r.text();
    console.log("Response:", text);
  })
  .catch(console.error);
