// src/components/Login.jsx
import React, { useState } from 'react';
import axios from '../axios'; // Make sure axios is configured properly
import { useNavigate } from "react-router-dom"; 

const Login = () => {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userdata, setUserdata] = useState(null); // Fixed state declaration
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/login', { Email, password });

      if (response.status === 200) {
        const { token, data } = response.data;

        console.log('User Data:', data);
        setUserdata(data);

        // Store the token in localStorage for authentication persistence
        localStorage.setItem('authToken', token);

        alert('Login successful!');
        navigate("/videochat");
      }
    } catch (err) {
      console.error('Login Error:', err.response?.data?.message || err.message);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={Email}
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
