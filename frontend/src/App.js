// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import VideoChat from './components/VideoChat';

// This component defines the routes and handles redirection after login.
const AppRoutes = () => {
  // Assume your custom hook returns the token (or null/undefined if not logged in)

 

 

  return (
    <div>
     
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
       <Route path="/videochat" element={<VideoChat/>}/>
        <Route
          path="/"
          element={
            <div>
              <h1>Welcome to Video Chat App</h1>
              <div>
                <Link to="/register">
                  <button>Register</button>
                </Link>
                <Link to="/login">
                  <button>Login</button>
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
