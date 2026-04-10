const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '../.env' }); // load jwt secret

async function testFlightBooking() {
    try {
        console.log("1. Authenticating...");
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'user@skyway.com', password: 'user123' })
        });
        
        const loginData = await loginResponse.json();
        const token = loginData.token;
        if (!token) return console.error('Failed to get token');

        console.log("2. Fetching a flight to book...");
        const flightResponse = await fetch('http://localhost:5000/api/flights?from=Mumbai&to=Delhi', {
            headers: { 'x-auth-token': token }
        });
        const flights = await flightResponse.json();
        if (flights.length === 0) return console.error('No flights');
        
        // Simulating the exact frontend mapping from Search.jsx
        const mappedFlights = flights.map(f => ({
            ...f,
            id: f.id || f.flightNumber || f._id
        }));
        
        const flight = mappedFlights[0];
        
        // Simulating the exact payload from BookingContext.jsx
        const payload = {
            bookingId: 'SKY-TEST-' + Date.now(),
            bookingType: 'flight',
            flight: flight._id || flight.id, // This is what frontend sends
            passengers: [{
                firstName: 'Test', lastName: 'User', email: 't@t.com',
                phone: '1234567890', passport: 'ABC1234', nationality: 'IN',
                dateOfBirth: '1990-01-01', gender: 'male'
            }],
            seats: [{
                id: flight.seatMap.find(s => !s.isOccupied).id,
                seatClass: 'economy', extraPrice: 0
            }],
            totalPrice: flight.price,
            paymentMethod: 'card',
            paymentDetails: 'Terminal test frontend mapping'
        };

        console.log("3. Sending booking request with flight ID:", payload.flight);
        const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(payload)
        });

        const status = bookingResponse.status;
        const responseData = await bookingResponse.json();
        
        console.log(`Response Status: ${status}`);
        console.log(`Response Data:`, responseData);

    } catch (e) {
        console.error("Script error:", e);
    }
}

testFlightBooking();
