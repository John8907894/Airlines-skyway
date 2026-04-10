const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '../.env' }); // load jwt secret

async function testHotelBooking() {
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

        console.log("2. Fetching a hotel to book...");
        const hotelResponse = await fetch('http://localhost:5000/api/hotels');
        const hotels = await hotelResponse.json();
        if (hotels.length === 0) return console.error('No hotels');
        const hotel = hotels[0];
        console.log(`Booking hotel: ${hotel.name}`);

        console.log("3. Creating hotel booking payload...");
        const payload = {
            bookingId: 'HTL-TEST-' + Date.now(),
            bookingType: 'hotel',
            hotel: hotel._id,
            checkIn: '2026-03-25',
            checkOut: '2026-03-27',
            nights: 2,
            guests: 2,
            passengers: [{
                firstName: 'Test',
                lastName: 'User',
                email: 'user@skyway.com'
            }],
            totalPrice: hotel.price * 2,
            paymentMethod: 'card',
            paymentDetails: 'Terminal test frontend mapping'
        };

        console.log("4. Sending hotel booking request...");
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

testHotelBooking();
