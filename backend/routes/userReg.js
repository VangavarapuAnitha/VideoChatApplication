const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');  // Import the database connection

const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password, interests } = req.body;

  if (!username || !email || !password || !interests) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the email already exists in the database
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(emailCheckQuery, [email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    // Insert the user into the database
    const insertUserQuery = `
      INSERT INTO users (username, email, password, interests)
      VALUES ($1, $2, $3, $4)
      RETURNING userid, username, email, interests
    `;
    const userResult = await pool.query(insertUserQuery, [username, email, hashedPassword, interests]);

    const newUser = userResult.rows[0];

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.userid, username: newUser.username }, // Payload
      process.env.JWT_SECRET, // Secret key from .env
      { expiresIn: '1h' } // Token expiration
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,  // Send token along with user details
      user: {
        userid: newUser.userid,
        username: newUser.username,
        email: newUser.email,
        interests: newUser.interests,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
