const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const pool = require('./db');  // Import the database connection
const userRoutes = require('./routes/userReg');  // Import user routes
const userAuth = require('./routes/userAuth');
const matchesRoutes = require('./routes/matches');


require('dotenv').config();

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());  // To parse JSON bodies

// Use the user routes
app.use('/api', userRoutes);
app.use('/api', userAuth);
app.use('/api', matchesRoutes);
// Database Connection Test (Optional)
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Database connection failed');
  }
});

// Socket.io Setup for Real-Time Communication
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Handle user joining a room
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    console.log(`User ${userId} joined room: ${roomId}`);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
      console.log(`User ${userId} disconnected from room: ${roomId}`);
    });
  });

  // Handle WebRTC signaling messages
  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', data);
  });
});


// Server Setup
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
