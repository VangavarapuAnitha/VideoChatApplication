const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken'); // Import the middleware
const router = express.Router();

// Backend route to fetch similar users
router.get('/similar-users', authenticateToken, async (req, res) => {
  const userId = req.userId; // Now `userId` is accessible from the token payload
  try {
    // Fetch the logged-in user's interests from the database
    const result = await pool.query("SELECT interests FROM users WHERE userid = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const interests = result.rows[0].interests;

    // Fetch similar users
    const similarUsersResult = await pool.query(`
      SELECT * FROM users
      WHERE ARRAY_LENGTH(ARRAY(SELECT unnest(interests) INTERSECT SELECT unnest($1::text[])), 1) > 0
      AND userid != $2
    `, [interests, userId]);

    return res.status(200).json(similarUsersResult.rows);
  } catch (err) {
    console.error("Error fetching similar users:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
