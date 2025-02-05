// In a file like routes/matches.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// GET /api/matches?userId=...
router.get('/matches', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  try {
    // Retrieve the current user's interests
    const userResult = await pool.query(
      "SELECT interests FROM users WHERE userid = $1",
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userInterests = userResult.rows[0].interests;
    
    // Query for other users that share at least one interest
    const matchesQuery = `
      SELECT userid, username, email, interests 
      FROM users 
      WHERE userid != $1 AND interests && $2::text[]
    `;
    const matchesResult = await pool.query(matchesQuery, [userId, userInterests]);
    
    res.json({ matches: matchesResult.rows });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
