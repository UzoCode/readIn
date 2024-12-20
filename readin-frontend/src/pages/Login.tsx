import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure React Router is being used

const Login: React.FC = () => {
  const [email, setEmail] = useState(''); // Declare email state
  const [password, setPassword] = useState(''); // Declare password state
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token); // Save token for authenticated requests
        navigate('/reader'); // Redirect to the reader page
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
