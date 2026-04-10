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
        if (!token) {
            console.error('Failed to get token:', loginData);
            return;
        }

        console.log("2. Fetching a flight to book...");
        const flightResponse = await fetch('http://localhost:5000/api/flights?from=Mumbai&to=Delhi', {
            headers: { 'x-auth-token': token }
        });
        const flights = await flightResponse.json();
        
        if (flights.length === 0) {
            console.error('No flights found to book');
            return;
        }
        
        const flightToBook = flights[0];
        console.log(`Booking flight: ${flightToBook.flightNumber}`);

        console.log("3. Creating booking payload...");
        const payload = {
            bookingType: 'flight',
            flight: flightToBook._id,
            seats: [{ id: flightToBook.seatMap.find(s => !s.isOccupied).id }],
            passengers: [{ firstName: 'Test', lastName: 'User' }],
            totalPrice: flightToBook.price,
            paymentMethod: 'card',
            paymentDetails: 'Terminal test',
            bookingId: 'SKY-TEST-' + Date.now()
        };

        console.log("4. Sending booking request...");
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


console.log('Script loaded successfully.');
