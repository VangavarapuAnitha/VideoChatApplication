// src/axios.js
import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend URL
});

// Add a request interceptor to attach the token to the headers of every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
