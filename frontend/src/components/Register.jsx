// src/components/Register.jsx
import React, { useState } from 'react';
import axios from '../axios'; // Ensure axios is properly configured
import { useNavigate } from "react-router-dom"; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const interestsArray = interests ? interests.split(',').map(item => item.trim()) : [];
    // Convert string to array

    try {
      const response = await axios.post('/register', {
        username,
        email,
        password,
        interests: interestsArray, // Send array instead of string
      });

      if (response.status === 201) {
        alert('User registered successfully!');
        navigate("/login");
      }
    } catch (err) {
      console.error('Registration Error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Interests (comma-separated):</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., coding, gaming, reading"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
