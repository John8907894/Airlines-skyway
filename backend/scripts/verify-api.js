async function testFlights() {
    try {
        // 1. Login to get token
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'user@skyway.com', password: 'user123' })
        });
        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('Login Status:', loginResponse.status);

        if (!token) {
            console.error('No token received');
            return;
        }

        // 2. Get flights with token
        const flightResponse = await fetch('http://localhost:5000/api/flights?from=Mumbai&to=Delhi', {
            headers: { 'x-auth-token': token }
        });
        const flightData = await flightResponse.json();
        console.log('Flight Status:', flightResponse.status);
        console.log('Flight count:', flightData.length);
        if (flightData.length > 0) {
            console.log('First flight:', flightData[0].flightNumber, 'from', flightData[0].from, 'to', flightData[0].to);
        }
    } catch (error) {
        console.error('Verification script error:', error);
    }
}

testFlights();
