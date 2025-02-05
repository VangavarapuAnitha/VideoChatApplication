// src/components/VideoChat.jsx
import React, { useState, useEffect } from 'react';
import axios from '../axios'; // Importing the configured axios instance

const VideoChat = () => {
  const [similarUsers, setSimilarUsers] = useState([]);
  const [error, setError] = useState('');
  const [callStatus, setCallStatus] = useState(null);

  useEffect(() => {
    const fetchSimilarUsers = async () => {
      try {
        // Send the GET request to fetch similar users
        const response = await axios.get('/similar-users');
        setSimilarUsers(response.data); // Store the fetched similar users
      } catch (err) {
        setError('Failed to load similar users.');
        console.error('Error fetching similar users:', err);
      }
    };

    fetchSimilarUsers(); // Call the function to fetch data on component mount
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleStartVideoCall = (userId) => {
    // Here you can initiate a video call (can integrate with WebRTC or any video calling service)
    console.log(`Initiating video call with user: ${userId}`);
    // Simulate initiating a video call (You can replace this logic with your actual video call logic)
    setCallStatus(`Initiating video call with user ${userId}`);
  };

  const handleAcceptCall = (callerId) => {
    // Handle accepting the video call from another user
    console.log(`Accepting call from user: ${callerId}`);
    // Simulate accepting the call (You can replace this logic with your actual video call logic)
    setCallStatus(`Accepting video call from user ${callerId}`);
  };

  return (
    <div>
      <h2>Similar Users for Video Chat</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if any */}
      <div>
        {similarUsers.length === 0 ? (
          <p>No similar users found.</p>
        ) : (
          similarUsers.map((user) => (
            <div key={user.userid}>
              <h3>{user.username}</h3>
              <button onClick={() => handleStartVideoCall(user.userid)}>
                Start Video Call
              </button>
            </div>
          ))
        )}
      </div>

      {/* Display call status if available */}
      {callStatus && <p>{callStatus}</p>}
    </div>
  );
};

export default VideoChat;
