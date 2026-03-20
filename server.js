const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 8080;

// Import UserLogin API and Model
const { router: userLoginRoutes, User } = require('./UserLogin');

// ---MongoDB Connection & User Model ---
// 1.Connect to MongoDB (ensure MongoDB is running locally or use your Atlas URI)
mongoose.connect('mongodb://localhost:27017/UserDB')
    .then(async () => {
        console.log('Connected to MongoDB');
        //2. Seed a default admin user if one does not exist
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            await new User({ username: 'admin', password: 'password123' }).save();
            console.log('System:Default admin account created');
        }
        // Seed a default regular user for testing
        const userExists = await User.findOne({ username: 'user' });
        if (!userExists) {
            await new User({ username: 'user', password: 'password' }).save();
            console.log('System:Default user account created');
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON bodies sent by script.js
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS, Images) from the current directory
app.use(express.static(__dirname));

// Route: Redirect root URL to indexpage.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Use the UserLogin API routes
app.use(userLoginRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
    console.log(`Access the page at http://127.0.0.1:${PORT}/index.html`);
});