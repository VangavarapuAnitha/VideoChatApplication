const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
    req.userId = decoded.userId; // Attach the userId from the decoded token to the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(403).json({ message: 'Invalid token, authorization denied' });
  }
}

module.exports = authenticateToken;
