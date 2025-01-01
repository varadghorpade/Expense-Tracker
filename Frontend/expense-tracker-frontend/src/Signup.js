import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username, // Include username here
        email,
        password
      });
      // Redirect to login page after successful signup
      window.location.href = '/login';  
    } catch (err) {
      setError(err.response.data.error || 'Sign-up failed');  // Show detailed error
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <div>{error}</div>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"  // Added Username field
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
