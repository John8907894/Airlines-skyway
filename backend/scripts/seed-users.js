const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../database/models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const users = [
    { name: 'User Demo', email: 'user@skyway.com', password: 'user123', role: 'user' },
    { name: 'Custom User', email: 'johndevadas922@gmail.com', password: '1234', role: 'user' },
    { name: 'Admin User', email: 'admin@skyway.com', password: 'admin123', role: 'admin' },
    { name: 'Jane Doe', email: 'jane@skyway.com', password: 'password', role: 'user' },
    { name: 'Alice Smith', email: 'alice@skyway.com', password: 'password', role: 'user' }
];

async function seedUsers() {
    try {
        const connectDB = require('../database/config/db');
        await connectDB();
        console.log('Connected to DB');

        for (const userData of users) {
            let existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`User ${userData.email} already exists. Attempting to update password.`);
                existingUser.password = userData.password;
                await existingUser.save();
                console.log(`Updated password for ${userData.email}.`);
            } else {
                const user = new User(userData);
                await user.save();
                console.log(`Created user ${userData.email}.`);
            }
        }
        
        console.log('Users seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding users:', err);
        process.exit(1);
    }
}

seedUsers();
