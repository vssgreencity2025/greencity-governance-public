const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = 8080;

// ---MongoDB Connection & User Model ---
// 1.Connect to MongoDB (ensure MongoDB is running locally or use your Atlas URI)
mongoose.connect('mongodb://localhost:27017/greenCityDB')
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
// 3. Define the User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, 
  password: { type: String, required: true }, //Note: In a real world app, hash password with bcrypt!
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// 4. Define the Login Log Schema to track activity
const loginLogSchema = new mongoose.Schema({
    username: String,
    timestamp: { type: Date, default: Date.now },
    success: Boolean
});
const LoginLog = mongoose.model('LoginLog', loginLogSchema);

// 5. Define the Registration Log Schema
const registrationLogSchema = new mongoose.Schema({
    username: String,
    timestamp: { type: Date, default: Date.now }
});
const RegistrationLog = mongoose.model('RegistrationLog', registrationLogSchema);

// Middleware to parse JSON bodies sent by script.js
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS, Images) from the current directory
app.use(express.static(__dirname));

// Route: Register a new User
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists." });
        }
        // Create and save new user
        await new User({ username, password }).save();

        // Create a log entry for the new registration
        await new RegistrationLog({ username }).save();

        console.log(`New user registered: ${username}`);
        res.json({ success: true, message: "User registered successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error registering user." });
    }
});

// Route: Handle the Login logic
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt: ${username}`); 
try {
    //check database for this username and password
    const user = await User.findOne({ username, password});

    // Create a log entry in the database for this attempt
    await new LoginLog({
        username: username,
        success: !!user // true if user found, false otherwise
    }).save();

    if (user) {
        res.json({ success: true, name: user.username}); 
    } else {
        res.json({ success: false, message: "Invalid username or password."});
    }
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Database server error "});
}

});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
    console.log(`Access the page at http://127.0.0.1:${PORT}/indexpage.html`);
});