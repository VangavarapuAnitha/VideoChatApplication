// src/routes/userAuth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Database pool connection

const router = express.Router();

// POST /login - User login endpoint
router.post('/login', async (req, res) => {
  const { Email, password } = req.body;
  console.log(req.body);

  // Check if Email and password are provided
  if (!Email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email (without checking password in SQL)
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [Email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
console.log(user);
    // Check if password is correct using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.userid, username: user.username}, // Payload
      process.env.JWT_SECRET, // Secret key from .env
      { expiresIn: '1h' } // Token expiration
    );
    const data={
      userid:user.userid,
      username:user.username,
      interests:user.interests || []
    }

    // Return success and the token
    return res.status(200).json({ message: 'Login successful', token,data });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
