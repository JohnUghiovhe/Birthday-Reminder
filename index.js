const express = require('express');
const path = require('path');
const { addUser, getAllUsers } = require('./database');
const cronJob = require('./cronJob');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to add a new user
app.post('/api/users', (req, res) => {
  try {
    const { username, email, dateOfBirth } = req.body;

    // Validation
    if (!username || !email || !dateOfBirth) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate date
    const date = new Date(dateOfBirth);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Add user to database
    addUser(username, email, dateOfBirth);
    
    res.status(201).json({ 
      message: 'User added successfully!',
      user: { username, email, dateOfBirth }
    });
  } catch (error) {
    if (error.code === 'UNIQUE_CONSTRAINT' || error.message.includes('UNIQUE constraint') || error.message.includes('Email already exists')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// API endpoint to get all users (optional, for testing)
app.get('/api/users', (req, res) => {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📅 Birthday reminder cron job is active (runs daily at 7:00 AM)`);
});