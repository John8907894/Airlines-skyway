const jwt = require('jsonwebtoken');

async function test() {
  const token = jwt.sign({ user: { id: "651234567890123456789012", role: "user" } }, "skyway_secret_key_2026");

  // Get flights
  const flightsRes = await fetch('http://localhost:5000/api/flights?from=DEL&to=BOM&date=2024-05-01');
  const flights = await flightsRes.json();
  const flight = flights[0];
  console.log("Using flight:", flight._id);

  const payload = {
    bookingId: "SKY-TEST-" + Date.now(),
    bookingType: 'flight',
    flight: flight._id,
    totalPrice: 5000,
    paymentMethod: 'card',
    seats: [{ id: "1A", seatClass: "economy", extraPrice: 0 }],
    passengers: [{ firstName: "Test", lastName: "User" }]
  };

  try {
    const res1 = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(payload)
    });
    console.log("Book 1 Status:", res1.status);
    console.log("Book 1 Resp:", await res1.text());
  } catch(e) { console.error("Book 1 Err:", e); }
}
test();
